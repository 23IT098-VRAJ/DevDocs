/**
 * Dashboard Page
 * Statistics, recent activity, and quick actions
 */

'use client';

import Link from 'next/link';
import { Button, Card, Spinner, EmptyState } from '@/components/ui';
import { useDashboard } from '@/hooks/useDashboard';
import { SolutionCard } from '@/components/solution/SolutionCard';

export default function DashboardPage() {
  const { stats, recentSolutions, isStatsLoading, isRecentLoading, statsError, recentError } = useDashboard();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-slate-400">Overview of your code solutions and activity</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Solutions */}
        <Card className="p-6 group hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all">
          {isStatsLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : statsError ? (
            <div className="text-red-400 text-sm">Error loading stats</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Total Solutions</h3>
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-100">{stats?.total_solutions || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Code snippets saved</p>
            </>
          )}
        </Card>

        {/* Languages */}
        <Card className="p-6 group hover:shadow-xl hover:shadow-violet-500/20 hover:border-violet-500/50 transition-all">
          {isStatsLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : statsError ? (
            <div className="text-red-400 text-sm">Error loading stats</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Languages</h3>
                <div className="p-2 bg-gradient-to-br from-violet-500/20 to-violet-600/20 border border-violet-500/30 rounded-lg group-hover:shadow-lg group-hover:shadow-violet-500/50 transition-all">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-100">{stats?.total_languages || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Programming languages</p>
            </>
          )}
        </Card>

        {/* Searches */}
        <Card className="p-6 group hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all">
          {isStatsLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : statsError ? (
            <div className="text-red-400 text-sm">Error loading stats</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Total Searches</h3>
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-100">{stats?.total_searches || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Semantic searches performed</p>
            </>
          )}
        </Card>

        {/* Average Similarity */}
        <Card className="p-6 group hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all">
          {isStatsLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : statsError ? (
            <div className="text-red-400 text-sm">Error loading stats</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Avg Similarity</h3>
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-lg group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {stats?.average_similarity ? `${(stats.average_similarity * 100).toFixed(1)}%` : '0%'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Search result accuracy</p>
            </>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/solution/create">
            <Card className="p-6 group cursor-pointer bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-2 border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:border-blue-500/60 hover:scale-[1.03] hover:from-blue-500/20 hover:to-violet-500/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg shadow-lg shadow-blue-500/50 group-hover:shadow-xl group-hover:shadow-blue-500/70 group-hover:scale-110 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-white transition-colors">Save Solution</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Add new code snippet</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="p-6 group cursor-pointer bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 hover:border-emerald-500/60 hover:scale-[1.03] hover:from-emerald-500/20 hover:to-cyan-500/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg shadow-lg shadow-emerald-500/50 group-hover:shadow-xl group-hover:shadow-emerald-500/70 group-hover:scale-110 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-white transition-colors">Search</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Find solutions semantically</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/solution">
            <Card className="p-6 group cursor-pointer bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-2 border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/50 hover:border-violet-500/60 hover:scale-[1.03] hover:from-violet-500/20 hover:to-fuchsia-500/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg shadow-lg shadow-violet-500/50 group-hover:shadow-xl group-hover:shadow-violet-500/70 group-hover:scale-110 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-white transition-colors">Browse All</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">View all solutions</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Solutions */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Recent Activity</h2>
          <Link href="/solution">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        {isRecentLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : recentError ? (
          <Card className="p-6 text-center">
            <p className="text-red-400">Error loading recent solutions</p>
          </Card>
        ) : !recentSolutions || recentSolutions.length === 0 ? (
          <EmptyState
            variant="solutions"
            title="No Solutions Yet"
            description="Start building your knowledge base by saving your first solution"
            action={
              <Link href="/solution/create">
                <Button variant="primary">
                  Create Your First Solution
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentSolutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
