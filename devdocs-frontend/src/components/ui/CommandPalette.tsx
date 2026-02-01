/**
 * Command Palette / Search Modal
 * Keyboard-triggered search with Cmd+K / Ctrl+K
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input, Spinner } from '@/components/ui';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'devdocs_recent_searches';
const MAX_RECENT = 5;

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter(s => s !== trimmed)
    ].slice(0, MAX_RECENT);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Handle search submission
  const handleSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose();
    setQuery('');
  }, [router, onClose, recentSearches]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      // Enter to search
      if (e.key === 'Enter' && isOpen && query) {
        handleSearch(query);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, handleSearch, onClose]);

  // Delete recent search
  const deleteRecentSearch = (searchQuery: string) => {
    const updated = recentSearches.filter(s => s !== searchQuery);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-black rounded-xl shadow-2xl shadow-black/50 border border-slate-700 overflow-hidden animate-scale-in">
          {/* Search Input */}
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code solutions..."
                className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 hover:bg-slate-900 transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-600 rounded">
                ESC
              </kbd>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Recent Searches
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition-colors"
                    onClick={() => handleSearch(search)}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-slate-300">{search}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded transition-all"
                    >
                      <svg className="w-4 h-4 text-slate-400 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-slate-700 bg-black">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-600 rounded">↵</kbd>
                  to search
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-600 rounded">ESC</kbd>
                  to close
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Hook to manage Command Palette state
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close command palette when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
