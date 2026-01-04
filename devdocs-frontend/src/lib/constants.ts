/**
 * Application constants and configuration.
 * Centralized location for all static values, limits, and settings.
 * Modify these values to adjust app behavior without changing component code.
 */

// ============================================================================
// APPLICATION INFO
// ============================================================================

export const APP_NAME = 'DevDocs';
export const APP_DESCRIPTION = 'AI-powered knowledge base for developers';
export const APP_TAGLINE = 'Save solutions in 30 seconds, search with natural language';
export const APP_VERSION = '1.0.0';

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_TIMEOUT = 15000; // 15 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SAVE_SOLUTION: '/save',
  SEARCH: '/search',
  SOLUTIONS: '/solutions',
  SOLUTION_DETAIL: (id: string) => `/solutions/${id}`,
  SOLUTION_EDIT: (id: string) => `/solutions/${id}/edit`,
} as const;

// ============================================================================
// PROGRAMMING LANGUAGES
// ============================================================================

/**
 * Supported programming languages
 * Keep in sync with backend language validation
 */
export const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'Dart',
  'Scala',
  'R',
  'Perl',
] as const;

/**
 * Popular languages shown first in dropdowns
 */
export const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
] as const;

/**
 * Language file extensions for syntax highlighting
 */
export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  JavaScript: 'js',
  TypeScript: 'ts',
  Python: 'py',
  Java: 'java',
  'C++': 'cpp',
  'C#': 'cs',
  Go: 'go',
  Rust: 'rs',
  Ruby: 'rb',
  PHP: 'php',
  Swift: 'swift',
  Kotlin: 'kt',
  HTML: 'html',
  CSS: 'css',
  SQL: 'sql',
  Shell: 'sh',
  Dart: 'dart',
  Scala: 'scala',
  R: 'r',
  Perl: 'pl',
};

// ============================================================================
// VALIDATION LIMITS
// ============================================================================

/**
 * Form field validation constraints
 * Must match backend Pydantic models
 */
export const VALIDATION = {
  TITLE: {
    MIN: 5,
    MAX: 200,
  },
  DESCRIPTION: {
    MIN: 20,
    MAX: 2000,
  },
  CODE: {
    MIN: 10,
    MAX: 5000,
  },
  LANGUAGE: {
    MIN: 2,
    MAX: 50,
  },
  TAG: {
    MIN: 2,
    MAX: 30,
  },
  TAGS: {
    MAX_COUNT: 10,
  },
  SEARCH_QUERY: {
    MIN: 3,
    MAX: 200,
  },
} as const;

// ============================================================================
// SEARCH CONFIGURATION
// ============================================================================

export const SEARCH = {
  /** Debounce delay for search input (ms) */
  DEBOUNCE_DELAY: 300,
  
  /** Default number of search results */
  DEFAULT_LIMIT: 5,
  
  /** Maximum number of search results */
  MAX_LIMIT: 20,
  
  /** Minimum query length to trigger search */
  MIN_QUERY_LENGTH: 3,
} as const;

// ============================================================================
// SIMILARITY THRESHOLDS
// ============================================================================

/**
 * Similarity score thresholds for result categorization
 * Based on cosine similarity (0.0 to 1.0)
 */
export const SIMILARITY_THRESHOLDS = {
  EXCELLENT: 0.90, // 90%+ = Perfect match
  GOOD: 0.75,      // 75-89% = Highly relevant
  FAIR: 0.60,      // 60-74% = Related solution
  POOR: 0.50,      // 50-59% = Somewhat related
} as const;

/**
 * Color coding for similarity levels (Tailwind CSS classes)
 */
export const SIMILARITY_COLORS = {
  excellent: 'text-green-600 bg-green-50',
  good: 'text-blue-600 bg-blue-50',
  fair: 'text-yellow-600 bg-yellow-50',
  poor: 'text-gray-600 bg-gray-50',
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  /** Default items per page */
  DEFAULT_PAGE_SIZE: 10,
  
  /** Available page size options */
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  
  /** Maximum items per page */
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI = {
  /** Code preview truncation length (characters) */
  CODE_PREVIEW_LENGTH: 200,
  
  /** Description truncation length (characters) */
  DESCRIPTION_PREVIEW_LENGTH: 150,
  
  /** Toast notification duration (ms) */
  TOAST_DURATION: 3000,
  
  /** Skeleton loading delay (ms) */
  SKELETON_DELAY: 200,
  
  /** Animation duration (ms) */
  ANIMATION_DURATION: 200,
} as const;

// ============================================================================
// DATE FORMATS
// ============================================================================

/**
 * Date formatting options for Intl.DateTimeFormat
 */
export const DATE_FORMATS = {
  SHORT: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
  LONG: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  TIME: {
    hour: '2-digit',
    minute: '2-digit',
  },
  FULL: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  SOLUTION_CREATED: 'Solution saved successfully!',
  SOLUTION_UPDATED: 'Solution updated successfully!',
  SOLUTION_DELETED: 'Solution deleted successfully!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'devdocs_recent_searches',
  PREFERRED_LANGUAGE: 'devdocs_preferred_language',
  THEME: 'devdocs_theme',
  LAST_VISITED: 'devdocs_last_visited',
} as const;

// ============================================================================
// RANK EMOJIS
// ============================================================================

/**
 * Emoji medals for search result rankings
 */
export const RANK_EMOJIS = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
} as const;

// ============================================================================
// METADATA
// ============================================================================

/**
 * SEO and Open Graph metadata
 */
export const METADATA = {
  TITLE: 'DevDocs - AI-Powered Developer Knowledge Base',
  DESCRIPTION: 'Save coding solutions in 30 seconds and search with natural language. Built for developers who need quick access to their knowledge.',
  KEYWORDS: [
    'developer tools',
    'knowledge base',
    'semantic search',
    'code snippets',
    'programming',
    'AI search',
  ],
  OG_IMAGE: '/og-image.png',
  TWITTER_HANDLE: '@devdocs',
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Feature toggles for gradual rollout
 */
export const FEATURES = {
  ENABLE_DASHBOARD: true,
  ENABLE_SEARCH: true,
  ENABLE_USER_AUTH: false, // Phase 2
  ENABLE_ANALYTICS: false, // Phase 2
  ENABLE_EXPORT: false,    // Phase 2
} as const;
