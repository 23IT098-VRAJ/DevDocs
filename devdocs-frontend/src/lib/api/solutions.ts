// DevDocs Frontend - Solutions API Service
import { apiClient } from './client';
import type { Solution, SolutionCreate, SolutionUpdate, SearchResult } from '@/lib/types';

export const solutionsApi = {
  // Get all solutions with filters
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    language?: string;
    tag?: string;
  }) => {
    const response = await apiClient.get('/api/solutions', { params });
    console.log('[Solutions API] Full response:', response);
    console.log('[Solutions API] Response data:', response.data);
    // Backend returns { solutions: [...], total: X, page: X, page_size: X, total_pages: X }
    // We need to extract just the solutions array
    return response.data.solutions || [];
  },

  // Get single solution
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/api/solutions/${id}`);
    return data;
  },

  // Create solution
  create: async (solution: SolutionCreate) => {
    const { data } = await apiClient.post('/api/solutions', solution);
    return data;
  },

  // Update solution
  update: async (id: string, solution: SolutionUpdate) => {
    const { data } = await apiClient.put(`/api/solutions/${id}`, solution);
    return data;
  },

  // Delete solution
  delete: async (id: string) => {
    await apiClient.delete(`/api/solutions/${id}`);
  },

  // Semantic search
  search: async (query: string, limit: number = 10) => {
    const { data } = await apiClient.post('/api/search', { query, limit, min_similarity: 0.3 });
    return data;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const { data } = await apiClient.get('/api/dashboard/stats');
    return data; // Stats are returned directly
  },

  // Recent solutions
  getRecent: async (limit: number = 10) => {
    const { data } = await apiClient.get('/api/dashboard/recent', { params: { limit } });
    return data.recent_solutions || []; // Extract recent_solutions array, default to empty array
  },

  // Popular tags
  getPopularTags: async (limit: number = 20) => {
    const { data } = await apiClient.get('/api/dashboard/popular-tags', { params: { limit } });
    return data;
  },
};
