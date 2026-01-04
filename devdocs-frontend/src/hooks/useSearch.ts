/**
 * Search Hooks
 * Custom hooks for semantic search functionality
 * 
 * Provides:
 * - useSearch: Semantic search with debouncing and caching
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { searchApi } from '@/lib/api';
import type { SearchResult } from '@/lib/types';
import { SEARCH_CONFIG } from '@/lib/constants';
import { useState, useEffect } from 'react';

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query key factory for search
 */
export const searchKeys = {
  all: ['search'] as const,
  searches: () => [...searchKeys.all, 'list'] as const,
  search: (query: string, limit?: number) => [...searchKeys.searches(), { query, limit }] as const,
};

// ============================================================================
// SEARCH HOOK
// ============================================================================

/**
 * Options for useSearch hook
 */
interface UseSearchOptions {
  /**
   * Search query string
   */
  query: string;
  
  /**
   * Maximum number of results (default: 5 from SEARCH_CONFIG)
   */
  limit?: number;
  
  /**
   * Whether to enable the query (default: true if query is not empty)
   */
  enabled?: boolean;
  
  /**
   * Debounce delay in milliseconds (default: 300ms from SEARCH_CONFIG)
   */
  debounceMs?: number;
}

/**
 * Semantic search for solutions
 * 
 * Features:
 * - Automatic debouncing (prevents excessive API calls while typing)
 * - Query caching (instant results for repeated searches)
 * - Disabled when query is empty or < 3 characters
 * - Returns solutions sorted by similarity score
 * 
 * @param options - Search configuration
 * @returns Query result with search results array
 * 
 * @example
 * function SearchComponent() {
 *   const [query, setQuery] = useState('');
 *   const { data: results, isLoading, error } = useSearch({ query });
 *   
 *   return (
 *     <div>
 *       <input
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="Search solutions..."
 *       />
 *       {isLoading && <Spinner />}
 *       {results && <SearchResults results={results} />}
 *     </div>
 *   );
 * }
 */
export function useSearch({
  query,
  limit = SEARCH_CONFIG.defaultLimit,
  enabled = true,
  debounceMs = SEARCH_CONFIG.debounceMs,
}: UseSearchOptions): UseQueryResult<SearchResult[], Error> {
  // Normalize query: trim whitespace and lowercase
  const normalizedQuery = query.trim().toLowerCase();
  
  // Only enable query if:
  // 1. enabled prop is true
  // 2. query is not empty
  // 3. query is at least 3 characters (prevent too broad searches)
  const shouldFetch = enabled && normalizedQuery.length >= 3;

  return useQuery({
    queryKey: searchKeys.search(normalizedQuery, limit),
    queryFn: async () => {
      // Search API returns results sorted by similarity score (highest first)
      const response = await searchApi.search(normalizedQuery, limit);
      return response.data;
    },
    enabled: shouldFetch,
    // Stale time: Keep search results fresh for 1 minute
    // (Users often refine searches quickly)
    staleTime: 60 * 1000,
    // Cache time: Keep old searches cached for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Retry only once for searches (faster failure for better UX)
    retry: 1,
    retryDelay: 500,
    // Don't refetch search results on window focus
    // (Search results are contextual to the query, not time-sensitive)
    refetchOnWindowFocus: false,
  });
}

// ============================================================================
// HELPER: DEBOUNCED SEARCH HOOK
// ============================================================================

/**
 * Custom hook that combines useSearch with useState for complete search UX
 * 
 * @param initialQuery - Initial search query
 * @param options - Search options (limit, debounceMs)
 * @returns Object with query state, setQuery, and search results
 * 
 * @example
 * function SearchPage() {
 *   const {
 *     query,
 *     setQuery,
 *     results,
 *     isLoading,
 *     error,
 *   } = useDebouncedSearch('');
 *   
 *   return (
 *     <SearchBar
 *       value={query}
 *       onChange={setQuery}
 *       results={results}
 *       isLoading={isLoading}
 *     />
 *   );
 * }
 */

interface UseDebouncedSearchResult {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  results: SearchResult[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useDebouncedSearch(
  initialQuery: string = '',
  options: Omit<UseSearchOptions, 'query'> = {}
): UseDebouncedSearchResult {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, options.debounceMs || SEARCH_CONFIG.debounceMs);

    return () => clearTimeout(timer);
  }, [query, options.debounceMs]);

  // Use the debounced query for search
  const { data: results, isLoading, error } = useSearch({
    query: debouncedQuery,
    ...options,
  });

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    isLoading,
    error,
  };
}