// DevDocs Frontend - API Module Exports
export * from './client';
export { solutionsApi } from './solutions';

// Re-export for convenience
export { apiClient } from './client';

// Dashboard API (direct import for proper return values)
import { solutionsApi } from './solutions';

export const dashboardApi = {
  getStats: () => solutionsApi.getDashboardStats(),
  getRecent: (limit?: number) => solutionsApi.getRecent(limit),
  getPopularTags: (limit?: number) => solutionsApi.getPopularTags(limit),
};

// Search API (direct import for proper return values)
export const searchApi = {
  search: (query: string, limit?: number) => solutionsApi.search(query, limit),
};
