/**
 * React Query Provider
 * Sets up QueryClient with default options and provides it to the app.
 * Includes React Query DevTools for development debugging.
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

/**
 * Create QueryClient with optimized default options
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        
        // Cache time: Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        
        // Retry failed requests 3 times with exponential backoff
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        
        // Refetch on reconnect
        refetchOnReconnect: true,
        
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get QueryClient instance
 * Creates new client on server, reuses client on browser
 */
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse existing client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

// ============================================================================
// EXPORTED PROVIDER
// ============================================================================

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider component
 * Wraps the app with React Query provider and dev tools
 * 
 * @example
 * // In app/layout.tsx
 * <QueryProvider>
 *   <YourApp />
 * </QueryProvider>
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client on first render
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Dev tools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
