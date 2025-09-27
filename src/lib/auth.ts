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


// Token refresh middleware state
interface RefreshState {
  isRefreshing: boolean
  refreshPromise: Promise<AuthResponse> | null
  failedQueue: Array<{
    resolve: (value: AuthResponse) => void
    reject: (error: Error) => void
  }>
}

export class AuthService {
  private baseUrl: string
  private refreshState: RefreshState = {
    isRefreshing: false,
    refreshPromise: null,
    failedQueue: []
  }

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

  // Enhanced fetch with automatic token refresh middleware
  private async authenticatedFetch(
    url: string, 
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<Response> {
    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, fetchOptions)

      // If the request was successful or this is already a retry, return the response
      if (response.ok || isRetry) {
        return response
      }

      // Check if the error is due to token expiration
      if (response.status === 401 || response.status === 403) {
        console.log('Token expired, attempting refresh...')
        
        // Try to refresh the token
        const refreshResult = await this.handleTokenRefresh()
        
        if (refreshResult.status === 'ok') {
          // Token refreshed successfully, retry the original request
          console.log('Token refreshed, retrying original request...')
          return this.authenticatedFetch(url, options, true)
        } else {
          // Refresh failed, logout user
          console.error('Token refresh failed, logging out user...')
          await this.logout()
          window.location.href = '/login'
          throw new Error('Authentication failed - please login again')
        }
      }

      return response
    } catch (error) {
      console.error('Authenticated fetch error:', error)
      throw error
    }
  }

  // Handle token refresh with queue management
  private async handleTokenRefresh(): Promise<AuthResponse> {
    // If already refreshing, return the existing promise
    if (this.refreshState.isRefreshing && this.refreshState.refreshPromise) {
      return this.refreshState.refreshPromise
    }

    // Start refresh process
    this.refreshState.isRefreshing = true
    this.refreshState.refreshPromise = this.refreshToken()

    try {
      const result = await this.refreshState.refreshPromise
      
      // Process queued requests
      this.processQueue(null, result)
      
      return result
    } catch (error) {
      // Process queued requests with error
      this.processQueue(error as Error, null)
      throw error
    } finally {
      // Reset refresh state
      this.refreshState.isRefreshing = false
      this.refreshState.refreshPromise = null
      this.refreshState.failedQueue = []
    }
  }

  // Process queued requests after token refresh
  private processQueue(error: Error | null, result: AuthResponse | null) {
    this.refreshState.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(result!)
      }
    })
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

  // Check if user is authenticated (now uses authenticated fetch)
  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}/users/me/`)
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

  // Generic authenticated API call method
  async authenticatedApiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}${endpoint}`, options)
      const data = await response.json()

      if (response.ok) {
        return data
      } else {
        throw new Error(data.message || `API call failed: ${response.status}`)
      }
    } catch (error) {
      console.error(`API call error for ${endpoint}:`, error)
      throw error
    }
  }

  // ========================================
  // USER API METHODS
  // ========================================

  // Get current user profile
  async getUserProfile(): Promise<any> {
    return this.authenticatedApiCall('/users/me/')
  }

  // Update user profile
  async updateUserProfile(data: any): Promise<any> {
    return this.authenticatedApiCall('/users/me/', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Get user settings
  async getUserSettings(): Promise<any> {
    return this.authenticatedApiCall('/users/settings/')
  }

  // Update user settings
  async updateUserSettings(data: any): Promise<any> {
    return this.authenticatedApiCall('/users/settings/', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Change user password
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return this.authenticatedApiCall('/users/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    })
  }

  // ========================================
  // DASHBOARD API METHODS
  // ========================================

  // Get dashboard data
  async getDashboardData(): Promise<any> {
    return this.authenticatedApiCall('/dashboard/')
  }

  // Get user statistics
  async getUserStats(): Promise<any> {
    return this.authenticatedApiCall('/dashboard/stats/')
  }

  // Get recent activity
  async getRecentActivity(): Promise<any> {
    return this.authenticatedApiCall('/dashboard/activity/')
  }


  // ========================================
  // UTILITY METHODS
  // ========================================

  // Generic GET request
  async get(endpoint: string): Promise<any> {
    return this.authenticatedApiCall(endpoint, { method: 'GET' })
  }

  // Generic POST request
  async post(endpoint: string, data?: any): Promise<any> {
    return this.authenticatedApiCall(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Generic PUT request
  async put(endpoint: string, data: any): Promise<any> {
    return this.authenticatedApiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Generic DELETE request
  async delete(endpoint: string): Promise<any> {
    return this.authenticatedApiCall(endpoint, { method: 'DELETE' })
  }

  // Generic PATCH request
  async patch(endpoint: string, data: any): Promise<any> {
    return this.authenticatedApiCall(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Upload file with authentication
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
      })

      const data = await response.json()

      if (response.ok) {
        return data
      } else {
        throw new Error(data.message || `File upload failed: ${response.status}`)
      }
    } catch (error) {
      console.error(`File upload error for ${endpoint}:`, error)
      throw error
    }
  }

  // Check if user is online
  async isOnline(): Promise<boolean> {
    return navigator.onLine
  }

  // Get request status with automatic retry
  async getWithRetry(endpoint: string, maxRetries: number = 3): Promise<any> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.get(endpoint)
      } catch (error) {
        lastError = error as Error
        console.warn(`Attempt ${attempt} failed for ${endpoint}:`, error)
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded')
  }
}

// Export a singleton instance
export const authService = new AuthService()

// Export utility functions for making authenticated API calls
export const authenticatedFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  return authService.authenticatedApiCall<T>(endpoint, options)
}

// Export specific API methods for convenience
export const userApi = {
  getProfile: () => authService.getUserProfile(),
  updateProfile: (data: any) => authService.updateUserProfile(data),
  getSettings: () => authService.getUserSettings(),
  updateSettings: (data: any) => authService.updateUserSettings(data),
  changePassword: (oldPassword: string, newPassword: string) => 
    authService.changePassword(oldPassword, newPassword),
}

export const dashboardApi = {
  getData: () => authService.getDashboardData(),
  getStats: () => authService.getUserStats(),
  getActivity: () => authService.getRecentActivity(),
}


// Export all APIs in one object
export const api = {
  user: userApi,
  dashboard: dashboardApi,
  // Generic methods
  get: (endpoint: string) => authService.get(endpoint),
  post: (endpoint: string, data?: any) => authService.post(endpoint, data),
  put: (endpoint: string, data: any) => authService.put(endpoint, data),
  delete: (endpoint: string) => authService.delete(endpoint),
  patch: (endpoint: string, data: any) => authService.patch(endpoint, data),
  upload: (endpoint: string, file: File, additionalData?: Record<string, any>) => 
    authService.uploadFile(endpoint, file, additionalData),
}