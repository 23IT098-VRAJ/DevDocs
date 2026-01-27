/**
 * Filter Sidebar Component
 * Advanced filtering for search and browse pages
 */

'use client';

import { useState, useEffect } from 'react';
import { LANGUAGES } from '@/lib/constants';
import { ColorTag, LanguageIcon } from '@/components/ui';

export interface FilterState {
  languages: string[];
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'date' | 'title';
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  availableTags?: string[];
  className?: string;
}

export function FilterSidebar({ onFilterChange, availableTags = [], className = '' }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    languages: [],
    tags: [],
    dateRange: 'all',
    sortBy: 'relevance',
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleLanguage = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      languages: [],
      tags: [],
      dateRange: 'all',
      sortBy: 'relevance',
    });
  };

  const activeFilterCount = filters.languages.length + filters.tags.length + 
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className={`bg-black border border-slate-700 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-200">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-900 rounded transition-colors"
          >
            <svg 
              className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Sort By</h3>
            <div className="space-y-2">
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'date', label: 'Date Added' },
                { value: 'title', label: 'Title (A-Z)' },
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Date Added</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'year', label: 'This Year' },
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={filters.dateRange === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-4 h-4 text-blue-500 bg-black border-slate-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Languages</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {LANGUAGES.slice(0, 10).map(lang => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(lang.toLowerCase())}
                    onChange={() => toggleLanguage(lang.toLowerCase())}
                    className="w-4 h-4 text-blue-500 bg-black border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <LanguageIcon language={lang.toLowerCase()} size="sm" showLabel />
                </label>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          {availableTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 12).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`transition-all ${
                      filters.tags.includes(tag)
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-800'
                        : ''
                    }`}
                  >
                    <ColorTag tag={tag} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
