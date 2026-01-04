/**
 * Hooks Index
 * Central export point for all custom hooks
 */

// Solution hooks
export {
  useSolutions,
  useSolution,
  useCreateSolution,
  useUpdateSolution,
  useDeleteSolution,
  solutionKeys,
} from './useSolutions';

// Search hooks
export {
  useSearch,
  useDebouncedSearch,
  searchKeys,
} from './useSearch';

// Dashboard hooks
export {
  useDashboardStats,
  useRecentSolutions,
  useDashboard,
  dashboardKeys,
} from './useDashboard';
