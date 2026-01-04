/**
 * TypeScript interfaces and types for DevDocs.
 * Defines all data models matching the backend API specification.
 * These types ensure type safety across the entire frontend application.
 */

// ============================================================================
// CORE DATA MODELS
// ============================================================================

/**
 * Solution - Main data model representing a coding solution
 * Matches the backend solutions table schema exactly
 */
export interface Solution {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Solution title (5-200 characters) */
  title: string;
  
  /** Detailed explanation (20-2000 characters) */
  description: string;
  
  /** Code snippet (10-5000 characters) */
  code: string;
  
  /** Programming language (e.g., "Python", "JavaScript") */
  language: string;
  
  /** Optional tags for categorization */
  tags: string[];
  
  /** ISO timestamp of creation */
  created_at: string;
  
  /** ISO timestamp of last update */
  updated_at: string;
  
  /** Soft delete flag (not returned in normal queries) */
  is_archived?: boolean;
}

/**
 * SolutionCreate - Input model for creating new solutions
 * Used in form submissions (POST /api/solutions)
 */
export interface SolutionCreate {
  /** Solution title (5-200 characters) */
  title: string;
  
  /** Detailed explanation (20-2000 characters) */
  description: string;
  
  /** Code snippet (10-5000 characters) */
  code: string;
  
  /** Programming language */
  language: string;
  
  /** Optional tags */
  tags?: string[];
}

/**
 * SolutionUpdate - Input model for updating existing solutions
 * Used in edit forms (PUT /api/solutions/{id})
 * All fields are optional (partial update)
 */
export interface SolutionUpdate {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string[];
}

// ============================================================================
// SEARCH MODELS
// ============================================================================

/**
 * SearchResult - Single search result with similarity score
 * Returned by GET /api/search
 */
export interface SearchResult {
  /** The matching solution */
  solution: Solution;
  
  /** Similarity score (0.0 to 1.0, where 1.0 is perfect match) */
  similarity: number;
  
  /** Result ranking (1 = best match, 2 = second best, etc.) */
  rank: number;
}

/**
 * SearchParams - Query parameters for search endpoint
 */
export interface SearchParams {
  /** Search query string (min 3 characters) */
  q: string;
  
  /** Maximum number of results (default: 5) */
  limit?: number;
}

// ============================================================================
// DASHBOARD MODELS
// ============================================================================

/**
 * DashboardStats - Aggregated statistics for dashboard
 * Returned by GET /api/dashboard/stats
 */
export interface DashboardStats {
  /** Total number of solutions in database */
  total_solutions: number;
  
  /** Number of unique programming languages */
  total_languages: number;
  
  /** Total number of searches performed */
  total_searches: number;
  
  /** Average similarity score across all searches */
  average_similarity: number;
}

// ============================================================================
// PAGINATION MODELS
// ============================================================================

/**
 * PaginationParams - Parameters for paginated list queries
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page: number;
  
  /** Items per page */
  limit: number;
  
  /** Optional filter by language */
  language?: string;
  
  /** Optional search query */
  search?: string;
}

/**
 * PaginatedResponse - Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  items: T[];
  
  /** Total number of items across all pages */
  total: number;
  
  /** Current page number */
  page: number;
  
  /** Items per page */
  limit: number;
  
  /** Total number of pages */
  total_pages: number;
  
  /** Whether there's a next page */
  has_next: boolean;
  
  /** Whether there's a previous page */
  has_prev: boolean;
}

// ============================================================================
// API ERROR MODELS
// ============================================================================

/**
 * APIError - Standard error response from backend
 */
export interface APIError {
  /** Error message */
  detail: string;
  
  /** HTTP status code */
  status?: number;
  
  /** Additional error details (for validation errors) */
  errors?: ValidationError[];
}

/**
 * ValidationError - Field-level validation error
 * Used in 422 Unprocessable Entity responses
 */
export interface ValidationError {
  /** Field location (e.g., ["body", "title"]) */
  loc: string[];
  
  /** Error message */
  msg: string;
  
  /** Error type */
  type: string;
}

// ============================================================================
// UI STATE MODELS
// ============================================================================

/**
 * LoadingState - Generic loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * FormState - Form submission state
 */
export interface FormState<T> extends LoadingState {
  data: T | null;
  isSuccess: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Language - Supported programming languages
 * Keep in sync with constants.ts LANGUAGES
 */
export type Language = 
  | 'JavaScript'
  | 'TypeScript'
  | 'Python'
  | 'Java'
  | 'C++'
  | 'C#'
  | 'Go'
  | 'Rust'
  | 'Ruby'
  | 'PHP'
  | 'Swift'
  | 'Kotlin';

/**
 * SimilarityLevel - Categorization of similarity scores
 */
export type SimilarityLevel = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * SortOrder - Sort direction
 */
export type SortOrder = 'asc' | 'desc';

/**
 * SolutionSortField - Fields that can be used for sorting solutions
 */
export type SolutionSortField = 'created_at' | 'updated_at' | 'title' | 'language';
