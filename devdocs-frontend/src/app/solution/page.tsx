/**
 * Browse Solutions Page
 * List of all solutions with filtering options
 */

'use client';

import Link from 'next/link';
import { useSolutions } from '@/hooks/useSolutions';
import { SolutionCard } from '@/components/solution/SolutionCard';
import { Button, Card, Spinner } from '@/components/ui';

export default function SolutionsPage() {
  const { data: solutions, isLoading, error } = useSolutions();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">All Solutions</h1>
          <p className="text-slate-400">
            Browse your entire knowledge base of code solutions
          </p>
        </div>
        <Link href="/solution/create">
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Solution
          </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      {solutions && solutions.length > 0 && (
        <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <p className="text-sm text-blue-400">
            <span className="font-semibold text-blue-300">{solutions.length}</span> solution{solutions.length !== 1 ? 's' : ''} in your knowledge base
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Failed to Load Solutions</h2>
          <p className="text-slate-400 mb-6">There was an error loading your solutions. Please try again.</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!solutions || solutions.length === 0) && (
        <Card className="p-16 text-center">
          <svg className="w-20 h-20 text-slate-600 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-3xl font-bold text-slate-100 mb-3">No Solutions Yet</h2>
          <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
            Start building your personal developer knowledge base by saving your first code solution
          </p>
          <Link href="/solution/create">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Solution
            </Button>
          </Link>
        </Card>
      )}

      {/* Solutions Grid */}
      {!isLoading && !error && solutions && solutions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      )}
    </div>
  );
}
