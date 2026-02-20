/**
 * Solution Detail Page
 * Full solution display with code, metadata, and actions
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSolution, useDeleteSolution } from '@/hooks/useSolutions';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { Home, ChevronRight, Share2, Edit, Trash2, Calendar, Copy, Check } from 'lucide-react';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';
import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface SolutionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { id } = use(params);
  const { loading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { data: solution, isLoading, error } = useSolution(id);
  const deleteMutation = useDeleteSolution();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this solution? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      router.push('/');
    } catch (err) {
      alert('Failed to delete solution. Please try again.');
    }
  }

  async function handleCopyCode() {
    if (solution) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(solution.code);
        } else {
          // Fallback for HTTP or older browsers
          const textarea = document.createElement('textarea');
          textarea.value = solution.code;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          textarea.style.top = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  }

  async function handleShare() {
    // Try Web Share API first (works on mobile and some modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: solution?.title,
          text: solution?.description,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    
    // Fallback: Copy URL to clipboard (works on HTTP too)
    try {
      const url = window.location.href;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for HTTP or older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }

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
    };
    return colors[language.toLowerCase()] || 'slate-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <GlassmorphicNavbar />
        <div className="pt-24 px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-black">
        <GlassmorphicNavbar />
        <div className="pt-24 px-4 py-8 max-w-7xl mx-auto">
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h2>
          <p className="text-gray-600 mb-6">The solution you're looking for doesn't exist or has been deleted.</p>
          {/* <Link href="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link> */}
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <GlassmorphicNavbar />
      <div className="pt-24 px-4 py-8 md:py-12 max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <Home size={16} />
            Home
          </Link>
          <ChevronRight size={14} className="text-white/40" />
          <Link href="/solution" className="text-white/60 hover:text-white transition-colors">
            Solutions
          </Link>
          <ChevronRight size={14} className="text-white/40" />
          <span className="text-[#07b9d5] truncate max-w-75">{solution.title}</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 mb-8 border-b border-white/10">
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#07b9d5] wrap-break-word">
              {solution.title}
            </h1>
            {/* Meta Text */}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar size={16} />
              <p>
                Created {formatDate(solution.created_at)}
                {solution.updated_at !== solution.created_at && (
                  <span> <span className="mx-1">•</span> Updated {formatDate(solution.updated_at)}</span>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href={`/solution/${id}/edit`}>
              <button className="flex items-center gap-2 h-10 px-5 rounded-lg border border-white/20 hover:bg-white/5 text-sm font-bold text-white transition-all">
                <Edit size={18} />
                Edit
              </button>
            </Link>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 h-10 px-5 rounded-lg bg-linear-to-r from-[#07b9d5] to-[#059ab3] text-black text-sm font-bold shadow-lg shadow-[#07b9d5]/20 hover:shadow-[#07b9d5]/40 transition-all"
            >
              {linkCopied ? (
                <>
                  <Check size={18} />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 size={18} />
                  Share
                </>
              )}
            </button>
          </div>
        </div>

        {/* Language Badge & Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className={`flex h-7 items-center gap-1.5 rounded-full bg-${getLanguageColor(solution.language)}/10 border border-${getLanguageColor(solution.language)}/20 px-3`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-${getLanguageColor(solution.language)}`}></span>
            <p className={`text-${getLanguageColor(solution.language)} text-xs font-bold uppercase tracking-wider`}>
              {solution.language}
            </p>
          </div>
          {solution.tags && solution.tags.map((tag, index) => (
            <div key={index} className="flex h-7 items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3">
              <p className="text-white/70 text-xs font-medium">{tag}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-3">Description</h3>
          <p className="text-white/70 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
            {solution.description}
          </p>
        </div>

        {/* Code Block */}
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-sm shadow-2xl mb-8">
          {/* Code Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              </div>
              <span className="text-xs font-mono text-white/60">
                code.{solution.language === 'javascript' ? 'js' : solution.language === 'typescript' ? 'ts' : solution.language === 'python' ? 'py' : 'txt'}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Code
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          <div className="overflow-x-auto p-4 md:p-6">
            <pre className="font-mono text-sm md:text-base leading-relaxed text-white/90">
              <code>{solution.code}</code>
            </pre>
          </div>
        </div>

        {/* Delete Button */}
        <div className="pt-8 border-t border-white/10">
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
          >
            <Trash2 size={18} />
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Solution'}
          </button>
        </div>
      </div>
    </div>
  );
}
