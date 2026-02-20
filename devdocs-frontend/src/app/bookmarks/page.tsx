'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Copy, Check, Code2, Calendar, Trash2, Home, ChevronRight, Sparkles } from 'lucide-react';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';
import { GlassmorphicFooter } from '@/components/layout/GlassmorphicFooter';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { bookmarksApi, solutionsApi } from '@/lib/api';
import type { Solution } from '@/lib/types';

export default function BookmarksPage() {
  const { loading } = useRequireAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);
      
      // Get all bookmarks for user
      const bookmarksData = await bookmarksApi.getAll();
      setBookmarks(bookmarksData);
      
      // Load solution details for each bookmark
      if (bookmarksData.length > 0) {
        const solutionPromises = bookmarksData.map((bookmark: any) =>
          solutionsApi.getById(bookmark.solution_id)
        );
        const solutionsData = await Promise.all(solutionPromises);
        setSolutions(solutionsData);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (code: string, solutionId: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        setCopiedId(solutionId);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopiedId(solutionId);
          setTimeout(() => setCopiedId(null), 2000);
        } else {
          console.error('Copy command was unsuccessful');
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRemoveBookmark = async (solutionId: string) => {
    try {
      setRemovingId(solutionId);
      await bookmarksApi.remove(solutionId);
      
      // Remove from local state
      setBookmarks(prev => prev.filter(b => b.solution_id !== solutionId));
      setSolutions(prev => prev.filter(s => s.id !== solutionId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    } finally {
      setRemovingId(null);
    }
  };

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

  return (
    <div className="min-h-screen bg-black">
      <GlassmorphicNavbar />
      
      <div className="pt-20 pb-12">
        <main className="max-w-6xl mx-auto px-6 lg:px-10 lg:pt-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-[#07b9d5]">Bookmarks</span>
          </div>

          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-[#07b9d5]/20 to-[#059ab3]/10 rounded-xl flex items-center justify-center border border-[#07b9d5]/30">
                <BookmarkCheck size={24} className="text-[#07b9d5]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
                <p className="text-white/60 text-sm">Your saved solutions collection</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Loading bookmarks...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && solutions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-[#07b9d5]/20 to-[#059ab3]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#07b9d5]/30">
                <Bookmark size={32} className="text-[#07b9d5]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Bookmarks Yet</h3>
              <p className="text-white/60 text-center max-w-md mb-6">
                Start bookmarking solutions you find useful. They'll appear here for easy access.
              </p>
              <Link
                href="/search"
                className="px-6 py-3 bg-linear-to-r from-[#07b9d5] to-[#059ab3] text-black text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all flex items-center gap-2"
              >
                <Sparkles size={18} />
                Search Solutions
              </Link>
            </div>
          )}

          {/* Bookmarks Grid */}
          {!isLoading && solutions.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <h3 className="text-white font-bold text-lg">
                  {solutions.length} {solutions.length === 1 ? 'Bookmark' : 'Bookmarks'}
                </h3>
              </div>

              <div className="grid gap-6">
                {solutions.map((solution) => (
                  <article
                    key={solution.id}
                    className="group relative backdrop-blur-2xl bg-black border border-[#07b9d5]/20 rounded-2xl p-6 hover:border-[#07b9d5]/40 hover:shadow-xl hover:shadow-[#07b9d5]/10 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link 
                          href={`/solution/${solution.id}`}
                          className="hover:text-[#07b9d5] transition-colors"
                        >
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#07b9d5] transition-colors">
                            {solution.title}
                          </h4>
                        </Link>
                        <p className="text-white/60 text-sm line-clamp-2">
                          {solution.description}
                        </p>
                      </div>
                    </div>

                    {/* Code Preview */}
                    {solution.code && (
                      <div className="relative mb-4 bg-black border border-white/20 rounded-xl p-4 overflow-hidden">
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <div className="size-2.5 rounded-full bg-red-500/20"></div>
                          <div className="size-2.5 rounded-full bg-yellow-500/20"></div>
                          <div className="size-2.5 rounded-full bg-green-500/20"></div>
                        </div>
                        <pre className="overflow-x-auto text-sm text-white/80 font-mono">
                          <code>{solution.code.substring(0, 300)}{solution.code.length > 300 ? '...' : ''}</code>
                        </pre>
                        {solution.code.length > 300 && (
                          <div className="absolute bottom-0 left-0 w-full h-8 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 mt-4">
                      {/* Language Badge */}
                      <div className="flex items-center gap-1.5 bg-black border border-white/20 px-3 py-1.5 rounded-lg">
                        <Code2 size={14} className="text-[#07b9d5]" />
                        <span className="text-white/70 text-xs font-medium">{solution.language}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-2">
                        {solution.tags && solution.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs text-white/50 hover:text-[#07b9d5] transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex-1"></div>

                      {/* Action Buttons */}
                      <button 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleRemoveBookmark(solution.id);
                        }}
                        disabled={removingId === solution.id}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-white/5"
                        title="Remove bookmark"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleCopy(solution.code, solution.id);
                        }}
                        className={`p-2 transition-colors rounded-full hover:bg-white/5 ${
                          copiedId === solution.id
                            ? 'text-green-400'
                            : 'text-white/40 hover:text-white'
                        }`}
                        title={copiedId === solution.id ? "Copied!" : "Copy code"}
                      >
                        {copiedId === solution.id ? (
                          <Check size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-white/40 text-xs">
                        <Calendar size={14} />
                        <span>{new Date(solution.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      
      <GlassmorphicFooter />
    </div>
  );
}
