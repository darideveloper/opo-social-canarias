export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  status: string
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name?: string
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
    // Use environment variable for external backend API base URL
    this.baseUrl = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000'
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

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      return {
        status: 'error',
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
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

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      return data
    } catch (error) {
      console.error('Registration error:', error)
      return {
        status: 'error',
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
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

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed')
      }

      return data
    } catch (error) {
      console.error('Token refresh error:', error)
      return {
        status: 'error',
        success: false,
        message:
          error instanceof Error ? error.message : 'Token refresh failed',
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

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed')
      }

      return data
    } catch (error) {
      console.error('Logout error:', error)
      return {
        status: 'error',
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
      }
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/`, {
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication check failed')
      }

      return data
    } catch (error) {
      console.error('Auth check error:', error)
      return {
        status: 'error',
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Authentication check failed',
      }
    }
  }
}

// Export a singleton instance
export const authService = new AuthService()
