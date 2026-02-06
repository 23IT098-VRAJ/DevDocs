/**
 * Browse Solutions Page
 * List of all solutions with filtering options
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSolutions } from '@/hooks/useSolutions';
import { Code2, ChevronDown, Filter, X, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';
import { GlassmorphicFooter } from '@/components/layout/GlassmorphicFooter';
import { Solution } from '@/lib/types';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const ITEMS_PER_PAGE = 6;

export default function SolutionsPage() {
  const { loading: authLoading } = useRequireAuth();
  const { data: solutions, isLoading, error } = useSolutions();

  // All useState hooks must be called before any conditional returns
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Debug logging
  React.useEffect(() => {
    console.log('Browse Solutions data:', { solutions, isLoading, error });
  }, [solutions, isLoading, error]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate language counts
  const languageCounts = useMemo(() => {
    if (!solutions || !Array.isArray(solutions)) return {};
    const counts: Record<string, number> = {};
    solutions.forEach(sol => {
      counts[sol.language] = (counts[sol.language] || 0) + 1;
    });
    return counts;
  }, [solutions]);

  // Get popular tags
  const popularTags = useMemo(() => {
    if (!solutions || !Array.isArray(solutions)) return [];
    const tagCounts: Record<string, number> = {};
    solutions.forEach(sol => {
      if (sol.tags) {
        sol.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [solutions]);

  // Filter and sort solutions
  const filteredSolutions = useMemo(() => {
    if (!solutions || !Array.isArray(solutions)) return [];
    
    let filtered = [...solutions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(sol =>
        sol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(sol => selectedLanguages.includes(sol.language));
    }


    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(sol =>
        sol.tags && selectedTags.some(tag => sol.tags!.includes(tag))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [solutions, searchQuery, selectedLanguages, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSolutions.length / ITEMS_PER_PAGE);
  const paginatedSolutions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSolutions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSolutions, currentPage]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedLanguages([]);
    setSelectedTags([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      python: '🐍',
      rust: '🦀',
      'c++': '⚙️',
      typescript: '🔷',
      java: '☕',
      go: '🐹',
      css: '🎨',
    };
    return icons[language.toLowerCase()] || '📄';
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'yellow-400',
      python: 'green-400',
      rust: 'orange-400',
      'c++': 'pink-400',
      typescript: 'blue-500',
      java: 'red-400',
      go: 'cyan-400',
      css: 'blue-400',
      react: 'purple-400',
    };
    return colors[language.toLowerCase()] || 'slate-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Added today';
    if (diffInDays === 1) return 'Added yesterday';
    if (diffInDays < 7) return `Added ${diffInDays} days ago`;
    if (diffInDays < 30) return `Added ${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `Added ${Math.floor(diffInDays / 30)} months ago`;
    return `Added ${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-black">
      <GlassmorphicNavbar />
      <div className="pt-20 flex min-h-screen">
        {/* Left Sidebar: Filters */}
        <aside className="w-80 border-r border-white/20 flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto hidden lg:block bg-black">
          <div className="p-6 flex flex-col gap-6">
            {/* Filters Header */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter size={20} className="text-[#07b9d5]" />
                Filters
              </h3>
              
              {/* Search Within Results */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search within results..."
                  className="w-full rounded-lg text-white bg-black border border-white/20 h-10 px-4 pl-10 text-sm focus:outline-none focus:border-[#07b9d5]/50 focus:ring-1 focus:ring-[#07b9d5]/50 transition-all placeholder:text-white/40"
                />
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 block">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none rounded-lg text-white bg-black border border-white/20 h-10 px-4 pr-10 text-sm focus:outline-none focus:border-[#07b9d5]/50 focus:ring-1 focus:ring-[#07b9d5]/50 transition-all [&>option]:bg-black [&>option]:text-white"
                  >
                    <option value="newest" className="bg-black text-white">Newest First</option>
                    <option value="oldest" className="bg-black text-white">Oldest First</option>
                    <option value="alphabetical" className="bg-black text-white">Alphabetical</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Languages</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(languageCounts).map(([lang, count]) => (
                  <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="w-4 h-4 rounded border-white/20 bg-black text-[#07b9d5] focus:ring-offset-0 focus:ring-1 focus:ring-[#07b9d5] checked:bg-[#07b9d5] checked:border-[#07b9d5] transition-all"
                    />
                    <span className="text-white/70 group-hover:text-white text-sm transition-colors capitalize">{lang}</span>
                    <span className="ml-auto text-xs text-white/40 bg-black border border-white/20 px-2 py-0.5 rounded">{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-[#07b9d5]/20 border border-[#07b9d5] text-[#07b9d5]'
                          : 'bg-black border border-white/20 text-white/60 hover:text-white hover:border-[#07b9d5]/40'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-[#07b9d5]">Solutions</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold tracking-tight mb-1">Browse All Solutions</h1>
            <p className="text-white/60">Manage and organize your code snippets efficiently.</p>
          </div>

          {/* Active Filters */}
          {(selectedLanguages.length > 0 || selectedTags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <span className="text-white/60 text-sm mr-2">Active:</span>
              {selectedLanguages.map(lang => (
                <div key={lang} className="flex items-center gap-2 bg-black text-[#07b9d5] px-3 py-1.5 rounded-full border border-[#07b9d5]/50 text-sm">
                  <span className="capitalize">{lang}</span>
                  <button onClick={() => toggleLanguage(lang)} className="hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {selectedTags.map(tag => (
                <div key={tag} className="flex items-center gap-2 bg-black text-[#07b9d5] px-3 py-1.5 rounded-full border border-[#07b9d5]/50 text-sm">
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button onClick={clearAllFilters} className="text-white/60 text-sm hover:text-white underline decoration-dotted underline-offset-4 ml-2">
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#07b9d5] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-black border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Solutions</h2>
              <p className="text-white/60 mb-6">There was an error loading your solutions. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredSolutions.length === 0 && (
            <div className="backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-16 text-center">
              <div className="w-20 h-20 bg-black border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code2 size={40} className="text-white/40" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {solutions && solutions.length > 0 ? 'No Results Found' : 'No Solutions Yet'}
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
                {solutions && solutions.length > 0
                  ? 'Try adjusting your filters or search query'
                  : 'Start building your personal developer knowledge base by saving your first code solution'}
              </p>
              {(!solutions || solutions.length === 0) && (
                <Link href="/solution/create">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all">
                    Create Your First Solution
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* Solutions Grid */}
          {!isLoading && !error && paginatedSolutions.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedSolutions.map((solution) => (
                  <Link key={solution.id} href={`/solution/${solution.id}`}>
                    <article className="group relative flex flex-col backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#07b9d5] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(7,185,213,0.3)] h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#07b9d5] text-xl flex-shrink-0">
                            {getLanguageIcon(solution.language)}
                          </div>
                          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[#07b9d5] transition-colors line-clamp-2">
                            {solution.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm line-clamp-3 mb-6 flex-1">
                        {solution.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <span className={`inline-flex items-center rounded bg-${getLanguageColor(solution.language)}/10 px-2 py-1 text-xs font-medium text-${getLanguageColor(solution.language)} ring-1 ring-inset ring-${getLanguageColor(solution.language)}/20 capitalize`}>
                          {solution.language}
                        </span>
                        <span className="text-xs text-white/40">{formatDate(solution.created_at)}</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-lg px-3 py-2 text-white/60 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors ${
                            currentPage === pageNum
                              ? 'z-10 bg-[#07b9d5] text-black'
                              : 'text-white ring-1 ring-inset ring-white/10 hover:bg-white/5'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white/60 ring-1 ring-inset ring-white/10">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 hover:bg-white/5 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-lg px-3 py-2 text-white/60 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                  
                  <p className="text-xs text-white/40">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSolutions.length)} of {filteredSolutions.length} results
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      
      <GlassmorphicFooter />
    </div>
  );
}
