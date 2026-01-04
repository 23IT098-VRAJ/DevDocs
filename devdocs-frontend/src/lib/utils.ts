/**
 * Utility functions for DevDocs.
 * Provides reusable helper functions for formatting, validation, and common operations.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  SIMILARITY_THRESHOLDS,
  SIMILARITY_COLORS,
  DATE_FORMATS,
  UI,
} from './constants';
import { SimilarityLevel } from './types';

// ============================================================================
// STYLING UTILITIES
// ============================================================================

/**
 * Merge Tailwind CSS classes intelligently
 * Combines clsx for conditional classes and twMerge for deduplication
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6') 
 * // => 'px-6 py-2 bg-blue-500' (px-4 overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Format ISO date string to human-readable format
 * @param dateString - ISO 8601 date string (e.g., "2024-12-28T15:30:00Z")
 * @param format - Format type from DATE_FORMATS
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2024-12-28T15:30:00Z', 'SHORT') 
 * // => 'Dec 28, 2024'
 */
export function formatDate(
  dateString: string,
  format: keyof typeof DATE_FORMATS = 'SHORT'
): string {
  try {
    const date = new Date(dateString);
    const options = DATE_FORMATS[format] as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return 'Invalid date';
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 * @param dateString - ISO 8601 date string
 * @returns Relative time string
 * 
 * @example
 * getRelativeTime('2024-12-28T15:30:00Z') 
 * // => '2 hours ago' (if current time is 17:30)
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return 'Unknown';
  }
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated text with '...' if needed
 * 
 * @example
 * truncateText('This is a very long text', 10) 
 * // => 'This is a...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * capitalize('hello world') // => 'Hello world'
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to slug format (lowercase, hyphens)
 * @param str - String to slugify
 * @returns Slug string
 * 
 * @example
 * slugify('Hello World!') // => 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// ============================================================================
// SIMILARITY UTILITIES
// ============================================================================

/**
 * Categorize similarity score into levels
 * @param similarity - Similarity score (0.0 to 1.0)
 * @returns Similarity level category
 * 
 * @example
 * getSimilarityLevel(0.95) // => 'excellent'
 * getSimilarityLevel(0.80) // => 'good'
 */
export function getSimilarityLevel(similarity: number): SimilarityLevel {
  if (similarity >= SIMILARITY_THRESHOLDS.EXCELLENT) return 'excellent';
  if (similarity >= SIMILARITY_THRESHOLDS.GOOD) return 'good';
  if (similarity >= SIMILARITY_THRESHOLDS.FAIR) return 'fair';
  return 'poor';
}

/**
 * Get Tailwind CSS color classes for similarity score
 * @param similarity - Similarity score (0.0 to 1.0)
 * @returns Tailwind CSS class string
 * 
 * @example
 * getSimilarityColor(0.95) 
 * // => 'text-green-600 bg-green-50'
 */
export function getSimilarityColor(similarity: number): string {
  const level = getSimilarityLevel(similarity);
  return SIMILARITY_COLORS[level];
}

/**
 * Format similarity score as percentage
 * @param similarity - Similarity score (0.0 to 1.0)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * 
 * @example
 * formatSimilarity(0.8765) // => '88%'
 * formatSimilarity(0.8765, 1) // => '87.7%'
 */
export function formatSimilarity(similarity: number, decimals: number = 0): string {
  return `${(similarity * 100).toFixed(decimals)}%`;
}

// ============================================================================
// CLIPBOARD UTILITIES
// ============================================================================

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise resolving to success boolean
 * 
 * @example
 * await copyToClipboard('console.log("Hello")');
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern clipboard API (requires HTTPS)
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if string is valid UUID
 * @param str - String to validate
 * @returns True if valid UUID
 * 
 * @example
 * isValidUUID('550e8400-e29b-41d4-a716-446655440000') // => true
 * isValidUUID('invalid-uuid') // => false
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Check if string is valid email
 * @param email - Email string to validate
 * @returns True if valid email
 * 
 * @example
 * isValidEmail('user@example.com') // => true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567) // => '1,234,567'
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Clamp number between min and max values
 * @param num - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 * 
 * @example
 * clamp(5, 0, 10) // => 5
 * clamp(-5, 0, 10) // => 0
 * clamp(15, 0, 10) // => 10
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Remove duplicate items from array
 * @param arr - Array with potential duplicates
 * @returns Array with unique items
 * 
 * @example
 * unique([1, 2, 2, 3, 3, 4]) // => [1, 2, 3, 4]
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Group array items by key
 * @param arr - Array to group
 * @param keyFn - Function to extract grouping key
 * @returns Object with grouped items
 * 
 * @example
 * groupBy([{lang: 'JS'}, {lang: 'Python'}, {lang: 'JS'}], item => item.lang)
 * // => { JS: [{...}, {...}], Python: [{...}] }
 */
export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Create debounced function that delays execution
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch('test'); // Waits 300ms before executing
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

/**
 * Safely get item from localStorage with JSON parsing
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default
 * 
 * @example
 * getStorageItem<string[]>('recent_searches', [])
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to get storage item:', error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage with JSON stringification
 * @param key - Storage key
 * @param value - Value to store
 * 
 * @example
 * setStorageItem('recent_searches', ['query1', 'query2'])
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to set storage item:', error);
  }
}

/**
 * Remove item from localStorage
 * @param key - Storage key
 * 
 * @example
 * removeStorageItem('recent_searches')
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove storage item:', error);
  }
}
