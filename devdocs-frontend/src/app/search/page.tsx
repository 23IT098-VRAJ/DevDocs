/**
 * Search Page
 * Semantic search with live results
 */

'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/form/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { useDebouncedSearch } from '@/hooks/useSearch';
import { Card } from '@/components/ui';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { results, isLoading, error } = useDebouncedSearch(query);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-3 animate-gradient">Semantic Code Search</h1>
        <p className="text-lg text-slate-400">Search using natural language - find solutions by meaning, not just keywords</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <SearchBar
          placeholder="Search for solutions (e.g., 'user authentication', 'file upload', 'database query')..."
          onSearch={setQuery}
          limit={10}
          className="w-full"
        />
      </div>

      {/* Search Tips (shown when no query) */}
      {!query && (
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-white/5 backdrop-blur-lg border-l-4 border-blue-500 shadow-xl shadow-blue-500/10">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Search Tips</h2>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong className="text-slate-200">Use natural language:</strong> "How to authenticate users" instead of just "auth"</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong className="text-slate-200">Be descriptive:</strong> "Upload images to S3" is better than "upload file"</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong className="text-slate-200">Semantic search:</strong> Finds similar concepts - search "login" to find "authentication"</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong className="text-slate-200">Minimum length:</strong> Enter at least 3 characters to search</span>
              </li>
            </ul>
          </Card>

          {/* Popular Searches Examples */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Try these example searches:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setQuery('user authentication')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                🔐 user authentication
              </button>
              <button
                onClick={() => setQuery('file upload')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                📁 file upload
              </button>
              <button
                onClick={() => setQuery('database connection')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                🔄 database connection
              </button>
              <button
                onClick={() => setQuery('API rate limiting')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                ⚡ API rate limiting
              </button>
              <button
                onClick={() => setQuery('JWT token')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                🎫 JWT token
              </button>
              <button
                onClick={() => setQuery('password hashing')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                🔒 password hashing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && (
        <SearchResults
          results={results || []}
          isLoading={isLoading}
          error={error?.message}
          query={query}
        />
      )}
    </div>
  );
}
