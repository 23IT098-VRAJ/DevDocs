/**
 * SearchResults Component
 * Container for displaying search results with loading and empty states
 */

'use client';

import { Spinner } from '@/components/ui';
import { ResultCard } from './ResultCard';
import type { SearchResult } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface SearchResultsProps {
  /**
   * Array of search results
   */
  results: SearchResult[] | undefined;
  
  /**
   * Loading state
   */
  isLoading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
  
  /**
   * Search query for empty state message
   */
  query: string;
  
  /**
   * Custom className
   */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SearchResults({
  results,
  isLoading,
  error,
  query,
  className = '',
}: SearchResultsProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Searching for "{query}"...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Search Error</h3>
        <p className="text-red-700">{error.message}</p>
      </div>
    );
  }

  // Empty State - No Query
  if (!query || query.length < 3) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Start Your Search
        </h3>
        <p className="text-gray-500">
          Enter at least 3 characters to search for code solutions
        </p>
      </div>
    );
  }

  // Empty State - No Results
  if (!results || results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-500 mb-4">
          No solutions found for "{query}"
        </p>
        <p className="text-sm text-gray-400">
          Try different keywords or create a new solution
        </p>
      </div>
    );
  }

  // Results List
  return (
    <div className={className}>
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Search Results
        </h2>
        <p className="text-gray-600 mt-1">
          Found {results.length} {results.length === 1 ? 'match' : 'matches'} for "{query}"
        </p>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}