/**
 * SearchBar Component
 * Global search with debouncing, live results dropdown, and keyboard navigation
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedSearch } from '@/hooks';
import { Input, Spinner, Badge } from '@/components/ui';
import { getSimilarityColor, getSimilarityLevel, truncateText } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface SearchBarProps {
  /**
   * Placeholder text for search input
   */
  placeholder?: string;
  
  /**
   * Whether to show results dropdown (default: true)
   */
  showDropdown?: boolean;
  
  /**
   * Maximum number of results to show (default: 5)
   */
  limit?: number;
  
  /**
   * Custom className for container
   */
  className?: string;
  
  /**
   * Callback when result is selected
   */
  onSelect?: (result: SearchResult) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SearchBar({
  placeholder = 'Search code solutions...',
  showDropdown = true,
  limit = 5,
  className = '',
  onSelect,
}: SearchBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use debounced search hook
  const {
    query,
    setQuery,
    results,
    isLoading,
  } = useDebouncedSearch('', { limit });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when results are available
  useEffect(() => {
    if (results && results.length > 0) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  }, [results]);

  // Handle keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!results || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }

  // Handle result selection
  function handleSelectResult(result: SearchResult) {
    setIsOpen(false);
    setQuery('');
    
    if (onSelect) {
      onSelect(result);
    } else {
      router.push(`/solution/${result.solution.id}`);
    }
  }

  // Handle clear button
  function handleClear() {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-20 py-3 text-base bg-slate-700/50 border border-slate-600 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 hover:bg-slate-600/50 transition-colors"
          style={{
            backgroundClip: 'padding-box',
          }}
        />
        
        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Spinner size="sm" />}
          
          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showDropdown && isOpen && results && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.solution.id}
              onClick={() => handleSelectResult(result)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-cyan-400/10' : ''
              }`}
            >
              {/* Title and Similarity */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-gray-900 line-clamp-1">
                  {result.solution.title}
                </h4>
                <Badge
                  variant={getSimilarityColor(result.similarity) as any}
                  size="sm"
                >
                  {Math.round(result.similarity * 100)}%
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {truncateText(result.solution.description, 120)}
              </p>

              {/* Language and Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info" size="sm">
                  {result.solution.language}
                </Badge>
                {result.solution.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
                {result.solution.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{result.solution.tags.length - 3} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && isOpen && query.length >= 3 && results && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}