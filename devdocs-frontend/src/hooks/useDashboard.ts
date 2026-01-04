/**
 * Dashboard Hooks
 * Custom hooks for dashboard data and statistics
 * 
 * Provides:
 * - useDashboardStats: Fetch dashboard statistics
 * - useRecentSolutions: Fetch recent solutions
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import type { DashboardStats, Solution } from '@/lib/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query key factory for dashboard
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recent: (limit?: number) => [...dashboardKeys.all, 'recent', limit] as const,
};

// ============================================================================
// DASHBOARD STATS HOOK
// ============================================================================

/**
 * Fetch dashboard statistics
 * 
 * Returns:
 * - total_solutions: Total number of solutions in database
 * - total_languages: Number of unique programming languages
 * - total_searches: Total number of searches performed
 * - recent_activity: Array of recent activities
 * 
 * Data is cached and refetches on window focus (always show fresh stats)
 * 
 * @returns Query result with dashboard stats
 * 
 * @example
 * function DashboardPage() {
 *   const { data: stats, isLoading } = useDashboardStats();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <div>
 *       <StatsCard label="Total Solutions" value={stats.total_solutions} />
 *       <StatsCard label="Languages" value={stats.total_languages} />
 *       <StatsCard label="Searches" value={stats.total_searches} />
 *       <ActivityFeed activities={stats.recent_activity} />
 *     </div>
 *   );
 * }
 */
export function useDashboardStats(): UseQueryResult<DashboardStats, Error> {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data;
    },
    // Stats are fresh for 30 seconds (balance between freshness and performance)
    staleTime: 30 * 1000,
    // Keep stats cached for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Refetch stats when user returns to tab (show fresh counts)
    refetchOnWindowFocus: true,
    // Refetch every 60 seconds while tab is active
    refetchInterval: 60 * 1000,
  });
}

// ============================================================================
// RECENT SOLUTIONS HOOK
// ============================================================================

/**
 * Options for useRecentSolutions hook
 */
interface UseRecentSolutionsOptions {
  /**
   * Maximum number of recent solutions (default: 5)
   */
  limit?: number;
  
  /**
   * Whether to enable the query (default: true)
   */
  enabled?: boolean;
}

/**
 * Fetch recent solutions
 * 
 * Returns the most recently created solutions, sorted by created_at descending
 * 
 * @param options - Configuration options
 * @returns Query result with recent solutions array
 * 
 * @example
 * function RecentActivity() {
 *   const { data: solutions, isLoading } = useRecentSolutions({ limit: 10 });
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <div>
 *       <h3>Recent Solutions</h3>
 *       {solutions.map((solution) => (
 *         <SolutionCard key={solution.id} solution={solution} />
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useRecentSolutions({
  limit = 5,
  enabled = true,
}: UseRecentSolutionsOptions = {}): UseQueryResult<Solution[], Error> {
  return useQuery({
    queryKey: dashboardKeys.recent(limit),
    queryFn: async () => {
      const response = await dashboardApi.getRecent(limit);
      return response.data;
    },
    enabled,
    // Recent solutions are fresh for 1 minute
    staleTime: 60 * 1000,
    // Keep cached for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Refetch when user returns to tab
    refetchOnWindowFocus: true,
  });
}

// ============================================================================
// COMBINED DASHBOARD HOOK
// ============================================================================

/**
 * Combined hook that fetches both stats and recent solutions
 * 
 * Convenience hook for dashboard page that needs both data sources
 * 
 * @param recentLimit - Number of recent solutions to fetch (default: 5)
 * @returns Object with both stats and recent solutions queries
 * 
 * @example
 * function DashboardPage() {
 *   const {
 *     stats,
 *     recentSolutions,
 *     isLoading,
 *     isError,
 *   } = useDashboard();
 *   
 *   if (isLoading) return <Spinner fullScreen />;
 *   if (isError) return <ErrorMessage />;
 *   
 *   return (
 *     <>
 *       <DashboardHeader stats={stats} />
 *       <RecentActivity solutions={recentSolutions} />
 *     </>
 *   );
 * }
 */
export function useDashboard(recentLimit: number = 5) {
  const statsQuery = useDashboardStats();
  const recentQuery = useRecentSolutions({ limit: recentLimit });

  return {
    // Stats data
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,
    
    // Recent solutions data
    recentSolutions: recentQuery.data,
    isRecentLoading: recentQuery.isLoading,
    recentError: recentQuery.error,
    
    // Combined loading/error states
    isLoading: statsQuery.isLoading || recentQuery.isLoading,
    isError: statsQuery.isError || recentQuery.isError,
    error: statsQuery.error || recentQuery.error,
    
    // Refetch functions
    refetchStats: statsQuery.refetch,
    refetchRecent: recentQuery.refetch,
    refetchAll: () => {
      statsQuery.refetch();
      recentQuery.refetch();
    },
  };
}