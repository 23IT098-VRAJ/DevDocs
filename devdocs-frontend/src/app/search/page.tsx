'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Code2, Tag, Calendar, TrendingUp, Sparkles, Copy, Bookmark, ChevronRight, Home } from 'lucide-react';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';
import { GlassmorphicFooter } from '@/components/layout/GlassmorphicFooter';
import { useSearch } from '@/hooks/useSearch';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function SearchPage() {
  const { loading } = useRequireAuth();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [framework, setFramework] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Focus input on mount (client-side only)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Use the search hook with debounced query
  const { data: searchResults, isLoading: isSearching } = useSearch({
    query: debouncedQuery,
    limit: 20,
  });

  const availableLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP'];

  const filteredResults = searchResults?.filter(result => {
    if (language && result.solution.language !== language) return false;
    return true;
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setDebouncedQuery(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <GlassmorphicNavbar />
      <div className="pt-20 flex">
        {/* Left Sidebar: Filters */}
        <aside className="w-80 border-r border-white/10 p-6 flex flex-col gap-6 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto hidden lg:block">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-[#07b9d5]" />
              Filters
            </h3>
            
            {/* Language Filter */}
            <div className="mb-6">
              <label className="text-white/70 text-sm font-medium mb-3 block">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg text-white bg-black border border-white/10 h-12 px-4 text-sm focus:outline-none focus:border-[#07b9d5]/50 focus:ring-1 focus:ring-[#07b9d5]/50 transition-all [&>option]:bg-black [&>option]:text-white [&>option]:py-2"
              >
                <option value="" className="bg-black text-white">All Languages</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang} className="bg-black text-white">{lang}</option>
                ))}
              </select>
            </div>

            {/* Framework Filter */}
            <div className="mb-6">
              <label className="text-white/70 text-sm font-medium mb-3 block">Framework</label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g. FastAPI, React"
                className="w-full rounded-lg text-white bg-white/5 border border-white/10 h-12 px-4 text-sm focus:outline-none focus:border-[#07b9d5]/50 focus:ring-1 focus:ring-[#07b9d5]/50 transition-all placeholder:text-white/30"
              />
            </div>

            {/* Clear Filters */}
            {language && (
              <button
                onClick={() => {
                  setLanguage('');
                  setFramework('');
                }}
                className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 text-sm font-medium transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Pro Tip Card */}
          <div className="mt-auto backdrop-blur-xl bg-gradient-to-br from-[#07b9d5]/10 to-[#059ab3]/5 p-4 rounded-xl border border-[#07b9d5]/20">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-[#07b9d5]" />
              Pro Tip
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Use natural language queries like "How do I implement JWT auth?" for best results.
            </p>
          </div>
        </aside>

        {/* Main Content: Search & Results */}
        <main className="flex-1 p-6 lg:p-10 lg:pt-8 overflow-y-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-[#07b9d5]">Search</span>
          </div>

          {/* Hero Search Area */}
          <div className="w-full max-w-4xl mx-auto mb-10">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <div className="flex items-center h-16 bg-white/5 backdrop-blur-xl border border-[#07b9d5]/20 rounded-2xl group-focus-within:border-[#07b9d5]/50 group-focus-within:shadow-lg group-focus-within:shadow-[#07b9d5]/20 transition-all duration-300">
                  <div className="flex items-center justify-center pl-5 pr-3 text-[#07b9d5]">
                    <SearchIcon size={24} />
                  </div>
                  <input
                    type="text"
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search your solutions with natural language..."
                    className="flex-1 bg-transparent border-none text-white text-lg placeholder:text-white/40 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="mr-2 h-10 px-5 rounded-lg bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black text-sm font-bold hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </form>
            
            {/* Trending Tags */}
            <div className="flex items-center gap-3 mt-4 text-sm pl-2">
              <span className="text-white/40">Trending:</span>
              {['react-hooks', 'docker-compose', 'rust-async'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full bg-white/5 text-[#07b9d5] hover:bg-white/10 transition text-xs border border-white/10 hover:border-[#07b9d5]/30"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full max-w-4xl mx-auto">
            {debouncedQuery && (
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-white font-bold text-lg">Top Results</h3>
                <span className="text-white/40 text-sm">
                  {isSearching ? 'Searching...' : `Found ${filteredResults.length} matches`}
                </span>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                    <div className="h-32 bg-white/10 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-white/10 rounded w-16"></div>
                      <div className="h-6 bg-white/10 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State - No Query */}
            {!debouncedQuery && !isSearching && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-[#07b9d5]/20 to-[#059ab3]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#07b9d5]/30">
                  <Sparkles size={40} className="text-[#07b9d5]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Semantic Search</h3>
                <p className="text-white/60 text-center max-w-md mb-6">
                  Start typing to search through solutions using natural language. Our AI understands context and meaning, not just keywords.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['React hooks example', 'JWT authentication', 'Database optimization'].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQuery(example)}
                      className="px-4 py-2 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State - No Results */}
            {debouncedQuery && !isSearching && filteredResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <SearchIcon size={40} className="text-white/40" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Results Found</h3>
                <p className="text-white/60 text-center max-w-md">
                  Try adjusting your search query or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && filteredResults.length > 0 && (
              <div className="flex flex-col gap-6">
                {filteredResults.map((result) => (
                  <article
                    key={result.solution.id}
                    className="group relative backdrop-blur-2xl bg-white/5 border border-[#07b9d5]/20 rounded-2xl p-6 hover:border-[#07b9d5]/40 hover:shadow-xl hover:shadow-[#07b9d5]/10 transition-all duration-300 cursor-pointer"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#07b9d5] transition-colors">
                          {result.solution.title}
                        </h4>
                        <p className="text-white/60 text-sm line-clamp-2">
                          {result.solution.description}
                        </p>
                      </div>
                      {result.similarity && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="flex items-center gap-2 bg-gradient-to-r from-[#07b9d5]/20 to-[#059ab3]/10 border border-[#07b9d5]/30 px-3 py-1.5 rounded-lg">
                            <TrendingUp size={14} className="text-[#07b9d5]" />
                            <span className="text-[#07b9d5] font-bold text-sm">
                              {Math.round(result.similarity * 100)}% Match
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Code Preview */}
                    {result.solution.code && (
                      <div className="relative mb-4 bg-black/60 border border-white/10 rounded-xl p-4 overflow-hidden">
                        {/* Window Dots */}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <div className="size-2.5 rounded-full bg-red-500/20"></div>
                          <div className="size-2.5 rounded-full bg-yellow-500/20"></div>
                          <div className="size-2.5 rounded-full bg-green-500/20"></div>
                        </div>
                        <pre className="overflow-x-auto text-sm text-white/80 font-mono">
                          <code>{result.solution.code.substring(0, 300)}{result.solution.code.length > 300 ? '...' : ''}</code>
                        </pre>
                        {result.solution.code.length > 300 && (
                          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 mt-4">
                      {/* Language Badge */}
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                        <Code2 size={14} className="text-[#07b9d5]" />
                        <span className="text-white/70 text-xs font-medium">{result.solution.language}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-2">
                        {result.solution.tags && result.solution.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs text-white/50 hover:text-[#07b9d5] transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex-1"></div>

                      {/* Action Buttons */}
                      <button 
                        className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        title="Save to bookmarks"
                      >
                        <Bookmark size={18} />
                      </button>
                      <button 
                        className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        title="Copy code"
                      >
                        <Copy size={18} />
                      </button>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-white/40 text-xs">
                        <Calendar size={14} />
                        <span>{new Date(result.solution.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Load More Button */}
                {filteredResults.length >= 10 && (
                  <div className="mt-6 flex justify-center">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 border border-white/10 hover:border-[#07b9d5]/30">
                      Load More Solutions
                      <ChevronRight size={18} className="rotate-90" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <GlassmorphicFooter />
    </div>
  );
}
