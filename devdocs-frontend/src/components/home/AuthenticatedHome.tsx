'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

export default function AuthenticatedHome() {
  const { user } = useAuth();
  const router = useRouter();
  const { stats, recentSolutions, isLoading } = useDashboard(5);

  // Calculate language distribution from recent solutions
  const languageDistribution = React.useMemo(() => {
    if (!recentSolutions) return [];
    
    const langCounts: Record<string, number> = {};
    recentSolutions.forEach((solution) => {
      langCounts[solution.language] = (langCounts[solution.language] || 0) + 1;
    });
    
    return Object.entries(langCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  }, [recentSolutions]);

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07b9d5]/20 via-transparent to-transparent blur-3xl"></div>
          <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-[#07b9d5]">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer'}</span>
            </h1>
            <p className="text-slate-400 text-lg">Here&apos;s what&apos;s happening with your solutions today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="code"
            label="Total Solutions"
            value={isLoading ? '...' : stats?.total_solutions?.toString() || '0'}
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            icon="language"
            label="Languages"
            value={isLoading ? '...' : stats?.total_languages?.toString() || '0'}
            trend="5 active"
            trendUp={true}
          />
          <StatCard
            icon="search"
            label="Total Searches"
            value={isLoading ? '...' : stats?.total_searches?.toString() || '0'}
            trend="+8% this week"
            trendUp={true}
          />
          <StatCard
            icon="analytics"
            label="Avg. Similarity"
            value={isLoading ? '...' : stats?.average_similarity ? `${Math.round(stats.average_similarity * 100)}%` : '0%'}
            trend="High accuracy"
            trendUp={true}
          />
        </div>

        {/* Two Column Layout for Recent Solutions and Language Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Solutions - Takes 2 columns */}
          <div className="lg:col-span-2 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Solutions</h2>
              <button 
                onClick={() => router.push('/solution')}
                className="text-[#07b9d5] text-sm hover:underline"
              >
                View All
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-black/50 border border-slate-700 rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : !recentSolutions || recentSolutions.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-slate-600 text-5xl mb-3">
                  code_off
                </span>
                <p className="text-slate-400">No solutions yet. Create your first one!</p>
                <button
                  onClick={() => router.push('/solution/create')}
                  className="mt-4 px-6 py-2 bg-[#07b9d5] text-black rounded-lg font-medium hover:bg-[#059ab3] transition-colors"
                >
                  Create Solution
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSolutions?.map((solution) => (
                  <button
                    key={solution.id}
                    onClick={() => router.push(`/solution/${solution.id}`)}
                    className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 hover:border-[#07b9d5] transition-colors text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#07b9d5] to-[#059ab3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-xl">
                          code
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-[#07b9d5] transition-colors truncate">
                          {solution.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                          {solution.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                            {solution.language}
                          </span>
                          <span className="text-xs text-slate-500">
                            {solution.language} • Updated {new Date(solution.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Distribution - Takes 1 column */}
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Language Distribution</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07b9d5]"></div>
              </div>
            ) : languageDistribution.length > 0 ? (
              <div className="space-y-4">
                {languageDistribution.map((lang) => (
                  <div key={lang.language}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{lang.language}</span>
                      <span className="text-sm font-medium text-[#07b9d5]">{lang.count}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#07b9d5] to-[#059ab3] transition-all duration-500"
                        style={{
                          width: `${(lang.count / (recentSolutions?.length || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-slate-600 text-4xl mb-3">
                  pie_chart
                </span>
                <p className="text-slate-400 text-sm">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

function StatCard({ icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#07b9d5] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#07b9d5] to-[#059ab3] rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-md ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
