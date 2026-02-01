/**
 * Solution Management Hooks
 * Custom hooks for managing solutions using React Query
 * 
 * Provides:
 * - useSolutions: Fetch all solutions
 * - useSolution: Fetch single solution by ID
 * - useCreateSolution: Create new solution
 * - useUpdateSolution: Update existing solution
 * - useDeleteSolution: Delete solution
 */

import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { solutionsApi } from '@/lib/api';
import type { Solution, SolutionCreate, SolutionUpdate } from '@/lib/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query key factory for solutions
 */
export const solutionKeys = {
  all: ['solutions'] as const,
  lists: () => [...solutionKeys.all, 'list'] as const,
  list: (filters: string) => [...solutionKeys.lists(), { filters }] as const,
  details: () => [...solutionKeys.all, 'detail'] as const,
  detail: (id: string) => [...solutionKeys.details(), id] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch all solutions
 * 
 * @returns Query result with solutions array
 * 
 * @example
 * const { data, isLoading, error } = useSolutions();
 * if (isLoading) return <Spinner />;
 * if (error) return <div>Error loading solutions</div>;
 * return <SolutionList solutions={data} />;
 */
export function useSolutions(): UseQueryResult<Solution[], Error> {
  return useQuery({
    queryKey: solutionKeys.lists(),
    queryFn: () => solutionsApi.getAll(),
  });
}

/**
 * Fetch single solution by ID
 * 
 * @param id - Solution UUID
 * @param enabled - Whether to run the query (default: true if id exists)
 * @returns Query result with solution data
 * 
 * @example
 * const { data: solution, isLoading } = useSolution(solutionId);
 * if (isLoading) return <Spinner />;
 * return <SolutionDetail solution={solution} />;
 */
export function useSolution(
  id: string | undefined,
  enabled: boolean = true
): UseQueryResult<Solution, Error> {
  return useQuery({
    queryKey: solutionKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Solution ID is required');
      return solutionsApi.getById(id);
    },
    enabled: enabled && !!id,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create new solution
 * 
 * Automatically invalidates solutions list after successful creation
 * 
 * @returns Mutation result with create function
 * 
 * @example
 * const createSolution = useCreateSolution();
 * 
 * async function handleSubmit(data: SolutionCreate) {
 *   try {
 *     const newSolution = await createSolution.mutateAsync(data);
 *     router.push(`/solution/${newSolution.id}`);
 *   } catch (error) {
 *     console.error('Failed to create solution:', error);
 *   }
 * }
 */
export function useCreateSolution(): UseMutationResult<Solution, Error, SolutionCreate> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SolutionCreate) => {
      return await solutionsApi.create(data);
    },
    onSuccess: () => {
      // Invalidate solutions list to refetch with new solution
      queryClient.invalidateQueries({ queryKey: solutionKeys.lists() });
    },
  });
}

/**
 * Update existing solution
 * 
 * Automatically invalidates both the solution detail and solutions list
 * 
 * @returns Mutation result with update function
 * 
 * @example
 * const updateSolution = useUpdateSolution();
 * 
 * async function handleUpdate(id: string, data: SolutionUpdate) {
 *   try {
 *     await updateSolution.mutateAsync({ id, data });
 *     toast.success('Solution updated successfully');
 *   } catch (error) {
 *     toast.error('Failed to update solution');
 *   }
 * }
 */
export function useUpdateSolution(): UseMutationResult<
  Solution,
  Error,
  { id: string; data: SolutionUpdate }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SolutionUpdate }) => {
      return await solutionsApi.update(id, data);
    },
    onSuccess: (data) => {
      // Invalidate the specific solution detail
      queryClient.invalidateQueries({ queryKey: solutionKeys.detail(data.id) });
      // Invalidate solutions list to reflect changes
      queryClient.invalidateQueries({ queryKey: solutionKeys.lists() });
    },
  });
}

/**
 * Delete solution
 * 
 * Automatically invalidates solutions list after successful deletion
 * 
 * @returns Mutation result with delete function
 * 
 * @example
 * const deleteSolution = useDeleteSolution();
 * 
 * async function handleDelete(id: string) {
 *   if (confirm('Are you sure?')) {
 *     try {
 *       await deleteSolution.mutateAsync(id);
 *       router.push('/dashboard');
 *     } catch (error) {
 *       toast.error('Failed to delete solution');
 *     }
 *   }
 * }
 */
export function useDeleteSolution(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await solutionsApi.delete(id);
    },
    onSuccess: (_, id) => {
      // Remove the specific solution from cache
      queryClient.removeQueries({ queryKey: solutionKeys.detail(id) });
      // Invalidate solutions list to remove deleted item
      queryClient.invalidateQueries({ queryKey: solutionKeys.lists() });
    },
  });
}