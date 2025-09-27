export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  status: string
  message: string
  data?: {
    user?: {
      id: string
      email: string
      name?: string
    }
  }
}

export interface ProtectedDataResponse {
  success: boolean
  data?: any
  message?: string
}

export class AuthService {
  private baseUrl: string

  constructor() {
    // Use proxy in development, environment variable in production
    this.baseUrl = import.meta.env.DEV 
      ? '/api'  // Use proxy in development
      : (import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000')  // Use env var in production
  }

  // Get API base URL
  getApiBaseUrl(): string {
    return this.baseUrl
  }

  // Check if running in development mode
  isDevelopment(): boolean {
    return import.meta.env.DEV || false
  }

  // Check if running in production mode
  isProduction(): boolean {
    return import.meta.env.PROD || false
  }

  // Get environment-specific configuration
  getConfig() {
    return {
      apiBaseUrl: this.getApiBaseUrl(),
      isDevelopment: this.isDevelopment(),
      isProduction: this.isProduction(),
    }
  }

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ username: email, password: password }),
      })

      const data = await response.json()

      // Use HTTP status codes to determine success/failure
      if (response.ok) {
        return {
          status: 'ok',
          message: data.message || 'Login successful',
          data: data.data
        }
      } else {
        // For non-2xx responses, return the error from backend
        return {
          status: 'error',
          message: data.message || 'Login failed',
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error occurred',
      }
    }
  }

  // Register
  async register(
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          status: 'ok',
          message: data.message || 'Registration successful',
          data: data.data
        }
      } else {
        return {
          status: 'error',
          message: data.message || 'Registration failed',
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error occurred',
      }
    }
  }

  // Refresh token when needed
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
        method: 'POST',
        credentials: 'include', // Uses refresh_token cookie
      })

      const data = await response.json()

      if (response.ok) {
        return {
          status: 'ok',
          message: data.message || 'Token refreshed successfully',
          data: data.data
        }
      } else {
        return {
          status: 'error',
          message: data.message || 'Token refresh failed',
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error occurred',
      }
    }
  }

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        return {
          status: 'ok',
          message: data.message || 'Logout successful',
          data: data.data
        }
      } else {
        return {
          status: 'error',
          message: data.message || 'Logout failed',
        }
      }
    } catch (error) {
      console.error('Logout error:', error)
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error occurred',
      }
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/`, {
        credentials: 'include',
      })
      console.log({response})

      const data = await response.json()

      if (response.ok) {
        return {
          status: 'ok',
          message: data.message || 'Authentication successful',
          data: data.data
        }
      } else {
        return {
          status: 'error',
          message: data.message || 'Authentication check failed',
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error occurred',
      }
    }
  }
}

// Export a singleton instance
export const authService = new AuthService()
