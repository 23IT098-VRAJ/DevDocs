/**
 * Dashboard Hooks
 * Custom hooks for dashboard data and statistics
 * 
 * Provides:
 * - useDashboardStats: Fetch dashboard statistics
 * - useRecentSolutions: Fetch recent solutions
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, solutionsApi } from '@/lib/api';
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
  // v2 = client-side computed (busts old server-side cached zeros)
  weeklyActivity: () => [...dashboardKeys.all, 'weekly-activity-v2'] as const,
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
    queryFn: () => dashboardApi.getStats(),
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
    queryFn: () => dashboardApi.getRecent(limit),
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
 * Compute weekly activity counts from a solutions array.
 *
 * Strategy:
 *  1. Build the 7 IST calendar dates for today and the 6 days before it.
 *  2. For every solution, convert its created_at (UTC, tz-naive from backend)
 *     to an IST date string and bucket it.
 *  3. Return [count_day-6, count_day-5, …, count_today] — oldest first,
 *     matching the bar order in AuthenticatedHome (index 6 = Today).
 */
function computeWeeklyActivity(solutions: { created_at: string; is_archived?: boolean }[]): number[] {
  const IST = 'Asia/Kolkata';
  const now = new Date();

  /** Format any Date as YYYY-MM-DD in IST (en-CA gives ISO date format) */
  const toISTDate = (d: Date): string =>
    new Intl.DateTimeFormat('en-CA', { timeZone: IST }).format(d);

  /** Safely parse a backend timestamp string as UTC regardless of Z suffix */
  const parseUTC = (raw: string): Date =>
    /Z$|[+-]\d{2}:\d{2}$/.test(raw) ? new Date(raw) : new Date(raw + 'Z');

  // Build the 7-slot date array: index 0 = 6 days ago, index 6 = today
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return toISTDate(d);
  });

  // Initialise counts map with 0 for each day
  const counts = new Map<string, number>(days.map(day => [day, 0]));

  // Bucket each (non-archived) solution into its IST creation date
  for (const sol of solutions) {
    if (!sol.created_at) continue;
    const istDate = toISTDate(parseUTC(sol.created_at));
    if (counts.has(istDate)) {
      counts.set(istDate, (counts.get(istDate) ?? 0) + 1);
    }
  }

  const result = days.map(day => counts.get(day) ?? 0);

  // Debug: log the computation so it can be verified in browser DevTools console
  console.log('[WeeklyActivity] IST days:', days);
  console.log('[WeeklyActivity] Solution IST dates:', solutions.map(s => s.created_at ? toISTDate(parseUTC(s.created_at)) : 'no-date'));
  console.log('[WeeklyActivity] Counts:', result);

  return result;
}

/**
 * Compute weekly activity (solutions created per IST day for the last 7 days).
 *
 * Fetches the full solution list from the backend and counts per IST calendar
 * day on the client — no SQL timezone logic involved.
 */
export function useWeeklyActivity(): UseQueryResult<number[], Error> {
  return useQuery({
    queryKey: dashboardKeys.weeklyActivity(),
    queryFn: async () => {
      // Fetch ALL solutions (limit=100 covers any reasonable personal library)
      const solutions = await solutionsApi.getAll({ limit: 100 });
      console.log('[WeeklyActivity] Fetched solutions count:', solutions.length, solutions[0]?.created_at);
      return computeWeeklyActivity(solutions);
    },
    staleTime: 0,          // always re-run on mount so fresh solutions are counted
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });
}

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
  const weeklyQuery = useWeeklyActivity();

  return {
    // Stats data
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,
    
    // Recent solutions data
    recentSolutions: recentQuery.data,
    isRecentLoading: recentQuery.isLoading,
    recentError: recentQuery.error,
    
    // Weekly activity data
    weeklyActivity: weeklyQuery.data,
    isWeeklyLoading: weeklyQuery.isLoading,
    weeklyError: weeklyQuery.error,
    
    // Combined loading/error states
    isLoading: statsQuery.isLoading || recentQuery.isLoading || weeklyQuery.isLoading,
    isError: statsQuery.isError || recentQuery.isError || weeklyQuery.isError,
    error: statsQuery.error || recentQuery.error || weeklyQuery.error,
    
    // Refetch functions
    refetchStats: statsQuery.refetch,
    refetchRecent: recentQuery.refetch,
    refetchWeekly: weeklyQuery.refetch,
    refetchAll: () => {
      statsQuery.refetch();
      recentQuery.refetch();
      weeklyQuery.refetch();
    },
  };
}