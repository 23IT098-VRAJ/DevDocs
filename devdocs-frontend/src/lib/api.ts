/**
 * API client for DevDocs backend communication.
 * Provides typed HTTP methods using Axios for all backend endpoints.
 * Includes interceptors for error handling, logging, and request/response transformation.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  Solution,
  SolutionCreate,
  SolutionUpdate,
  SearchResult,
  SearchParams,
  DashboardStats,
  PaginatedResponse,
  APIError,
} from './types';

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

/**
 * Base API URL from environment variables
 * Default: http://localhost:8000 (for development)
 * Production: Set NEXT_PUBLIC_API_URL in .env.production
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Create configured Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Add request ID and timestamp to all requests
 * Useful for debugging and request tracking
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp for latency tracking
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    // Suppress logging in request interceptor
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * Handle response errors and transform error messages
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<APIError>) => {
    // Extract error message
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.detail || 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = data?.detail || 'Resource not found';
          break;
        case 422:
          // Validation error - format multiple errors
          if (data?.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors
              .map((err) => `${err.loc.join('.')}: ${err.msg}`)
              .join(', ');
          } else {
            errorMessage = data?.detail || 'Validation error';
          }
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          errorMessage = data?.detail || `Error ${status}`;
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Error setting up request
      errorMessage = error.message || 'Request failed';
    }
    
    // Log error in development (only log server errors, not network/connection errors)
    if (process.env.NODE_ENV === 'development' && error.response) {
      console.error('[API Error]', {
        message: errorMessage,
        status: error.response.status,
        url: error.config?.url,
      });
    }
    
    // Throw formatted error
    return Promise.reject(new Error(errorMessage));
  }
);

// ============================================================================
// SOLUTIONS API
// ============================================================================

/**
 * Solutions API endpoints
 * Handles CRUD operations for coding solutions
 */
export const solutionsApi = {
  /**
   * Get all solutions (with optional pagination)
   * @param params - Pagination parameters
   * @returns Paginated list of solutions
   */
  async getAll(params?: { page?: number; limit?: number; language?: string }): Promise<Solution[]> {
    const response = await apiClient.get<Solution[]>('/api/solutions', { params });
    return response.data;
  },

  /**
   * Get a single solution by ID
   * @param id - Solution UUID
   * @returns Solution object
   */
  async getById(id: string): Promise<Solution> {
    const response = await apiClient.get<Solution>(`/api/solutions/${id}`);
    return response.data;
  },

  /**
   * Create a new solution
   * @param data - Solution creation data
   * @returns Created solution with ID
   */
  async create(data: SolutionCreate): Promise<Solution> {
    const response = await apiClient.post<Solution>('/api/solutions', data);
    return response.data;
  },

  /**
   * Update an existing solution
   * @param id - Solution UUID
   * @param data - Partial solution update data
   * @returns Updated solution
   */
  async update(id: string, data: SolutionUpdate): Promise<Solution> {
    const response = await apiClient.put<Solution>(`/api/solutions/${id}`, data);
    return response.data;
  },

  /**
   * Delete (archive) a solution
   * @param id - Solution UUID
   * @returns Success message
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/solutions/${id}`);
    return response.data;
  },
};

// ============================================================================
// SEARCH API
// ============================================================================

/**
 * Search API endpoints
 * Handles semantic search functionality
 */
export const searchApi = {
  /**
   * Search solutions using semantic similarity
   * @param params - Search query and limit
   * @returns Ranked search results with similarity scores
   */
  async search(params: SearchParams): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>('/api/search', { params });
    return response.data;
  },
};

// ============================================================================
// DASHBOARD API
// ============================================================================

/**
 * Dashboard API endpoints
 * Provides aggregated statistics and recent activity
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   * @returns Aggregated stats (total solutions, languages, searches)
   */
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  /**
   * Get recent solutions
   * @param limit - Number of recent solutions to fetch (default: 5)
   * @returns Array of recent solutions
   */
  async getRecent(limit: number = 5): Promise<Solution[]> {
    const response = await apiClient.get<Solution[]>('/api/dashboard/recent', {
      params: { limit },
    });
    return response.data;
  },
};

// ============================================================================
// HEALTH CHECK API
// ============================================================================

/**
 * Health check endpoint
 * Used to verify backend connectivity
 */
export const healthApi = {
  /**
   * Check backend health status
   * @returns Health status object
   */
  async check(): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>('/health');
    return response.data;
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Export configured API client for custom requests
 */
export default apiClient;
