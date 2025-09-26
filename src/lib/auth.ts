export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ProtectedDataResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export class AuthService {
  private baseUrl: string;

  constructor() {
    // Use environment variable for API base URL, fallback to relative path
    this.baseUrl = import.meta.env.PUBLIC_API_BASE_URL 
      ? `${import.meta.env.PUBLIC_API_BASE_URL}/auth`
      : '/api/auth';
  }

  // Get API base URL
  getApiBaseUrl(): string {
    return import.meta.env.PUBLIC_API_BASE_URL || '/api';
  }

  // Check if running in development mode
  isDevelopment(): boolean {
    return import.meta.env.DEV || false;
  }

  // Check if running in production mode
  isProduction(): boolean {
    return import.meta.env.PROD || false;
  }

  // Get environment-specific configuration
  getConfig() {
    return {
      apiBaseUrl: this.getApiBaseUrl(),
      isDevelopment: this.isDevelopment(),
      isProduction: this.isProduction(),
    };
  }

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  // Register
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  // Make authenticated requests
  async getProtectedData(): Promise<ProtectedDataResponse> {
    try {
      // Use environment variable for protected endpoint URL
      const protectedUrl = import.meta.env.PUBLIC_API_BASE_URL 
        ? `${import.meta.env.PUBLIC_API_BASE_URL}/protected`
        : '/api/protected';
        
      const response = await fetch(protectedUrl, {
        credentials: 'include' // Include cookies automatically
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch protected data');
      }
      
      return data;
    } catch (error) {
      console.error('Protected data error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch protected data'
      };
    }
  }

  // Refresh token when needed
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        credentials: 'include' // Uses refresh_token cookie
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  }

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }
      
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication check failed');
      }
      
      return data;
    } catch (error) {
      console.error('Auth check error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Authentication check failed'
      };
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();
