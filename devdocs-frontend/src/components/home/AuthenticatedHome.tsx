'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

export default function AuthenticatedHome() {
  const { user } = useAuth();
  const router = useRouter();
  const { stats, recentSolutions, weeklyActivity, isLoading } = useDashboard(3);

  // Debug logging
  React.useEffect(() => {
    console.log('Dashboard data:', { stats, recentSolutions, weeklyActivity, isLoading });
  }, [stats, recentSolutions, weeklyActivity, isLoading]);

  // Calculate language distribution from recent solutions
  const languageDistribution = React.useMemo(() => {
    if (!recentSolutions || !Array.isArray(recentSolutions)) return [];
    
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
          <div className="relative backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-[#07b9d5]">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer'}</span>
            </h1>
            <p className="text-slate-400 text-lg">Here&apos;s what&apos;s happening with your solutions today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Solutions Card - Enhanced with Graph */}
          <div className="relative backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-6 overflow-hidden group hover:border-[#07b9d5]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#07b9d5]/20 min-h-[320px]">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#07b9d5]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#07b9d5]/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#07b9d5] to-[#059ab3] rounded-xl flex items-center justify-center shadow-lg shadow-[#07b9d5]/30 group-hover:shadow-[#07b9d5]/50 group-hover:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-white text-3xl">terminal</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Total Solutions</p>
                    <p className="text-5xl font-bold text-white mt-1 tabular-nums">
                      {isLoading ? '...' : stats?.total_solutions?.toString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Weekly Activity Chart */}
              <div className="flex-1 flex flex-col justify-end mt-6">
                <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Last 7 Days Activity</p>
                <div className="flex items-end gap-2 h-32">
                  {(weeklyActivity || [0, 0, 0, 0, 0, 0, 0]).map((count, i) => {
                    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const maxCount = Math.max(...(weeklyActivity || [1]), 1);
                    const heightPercent = maxCount > 0 ? Math.max((count / maxCount) * 100, 8) : 8;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-[#07b9d5] to-cyan-400 rounded-t-lg relative group/bar transition-all duration-500 hover:from-[#07b9d5] hover:to-[#3ae0ff] cursor-pointer"
                          style={{
                            height: `${heightPercent}%`,
                            transitionDelay: `${i * 50}ms`,
                            boxShadow: count > 0 ? '0 0 20px rgba(7, 185, 213, 0.3)' : 'none',
                          }}
                        >
                          {/* Count Label */}
                          {count > 0 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#07b9d5] opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {count}
                            </div>
                          )}
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                            {count} solution{count !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Language Distribution Card - Enhanced with Pie Chart */}
          <div className="relative backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-6 overflow-hidden group hover:border-[#07b9d5]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#07b9d5]/20 min-h-[320px]">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#07b9d5]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#07b9d5]/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#07b9d5] to-[#059ab3] rounded-xl flex items-center justify-center shadow-lg shadow-[#07b9d5]/30 group-hover:shadow-[#07b9d5]/50 group-hover:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-white text-3xl">translate</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Languages Used</p>
                    <p className="text-5xl font-bold text-white mt-1 tabular-nums">{stats?.total_languages || 0}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 font-medium">
                  {stats?.total_languages || 0} active
                </span>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#07b9d5]"></div>
                </div>
              ) : stats?.language_breakdown && stats.language_breakdown.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                  {/* Pie Chart */}
                  <div className="flex-shrink-0 flex items-center justify-center lg:items-start">
                    <svg width="180" height="180" viewBox="0 0 200 200" className="transform -rotate-90">
                      {(() => {
                        const total = stats.total_solutions || 1;
                        let currentAngle = 0;
                        const colors = [
                          '#07b9d5', '#06a5bf', '#0e7490', '#0c6682', 
                          '#14b8a6', '#0891b2', '#0284c7', '#2563eb',
                          '#7c3aed', '#c026d3', '#db2777', '#dc2626'
                        ];
                        
                        return stats.language_breakdown.map((lang: any, index: number) => {
                          const percentage = (lang.count / total) * 100;
                          const angle = (percentage / 100) * 360;
                          const startAngle = currentAngle;
                          currentAngle += angle;
                          
                          // Convert to radians
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (currentAngle * Math.PI) / 180;
                          
                          // Calculate arc path
                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);
                          
                          const largeArc = angle > 180 ? 1 : 0;
                          const pathData = [
                            `M 100 100`,
                            `L ${x1} ${y1}`,
                            `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
                            `Z`
                          ].join(' ');
                          
                          return (
                            <path
                              key={lang.language}
                              d={pathData}
                              fill={colors[index % colors.length]}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                              style={{ filter: 'drop-shadow(0 0 8px rgba(7, 185, 213, 0.3))' }}
                            >
                              <title>{`${lang.language}: ${percentage.toFixed(1)}%`}</title>
                            </path>
                          );
                        });
                      })()}
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex-1 space-y-1.5 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    {stats.language_breakdown.map((lang: any, index: number) => {
                      const colors = [
                        '#07b9d5', '#06a5bf', '#0e7490', '#0c6682', 
                        '#14b8a6', '#0891b2', '#0284c7', '#2563eb',
                        '#7c3aed', '#c026d3', '#db2777', '#dc2626'
                      ];
                      const percentage = ((lang.count / (stats.total_solutions || 1)) * 100).toFixed(1);
                      
                      return (
                        <div key={lang.language} className="flex items-center justify-between gap-2 group/lang hover:bg-slate-800/30 rounded px-2 py-1 transition-colors">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div 
                              className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                              style={{ 
                                backgroundColor: colors[index % colors.length],
                                boxShadow: `0 0 6px ${colors[index % colors.length]}40`
                              }}
                            ></div>
                            <span className="text-xs text-slate-300 font-medium truncate">{lang.language}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] text-slate-500 tabular-nums">{lang.count}</span>
                            <span className="text-xs font-bold text-[#07b9d5] tabular-nums min-w-[2.5rem] text-right">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Solutions - Full Width */}
        <div className="backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-6">
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
                  <div key={i} className="bg-black border border-white/20 rounded-xl p-4 animate-pulse">
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
                {Array.isArray(recentSolutions) && recentSolutions.map((solution) => (
                  <button
                    key={solution.id}
                    onClick={() => router.push(`/solution/${solution.id}`)}
                    className="w-full bg-black border border-white/20 rounded-xl p-4 hover:border-[#07b9d5] transition-colors text-left group"
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
                          <span className="text-xs px-2 py-1 bg-black border border-white/20 text-slate-300 rounded-md">
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
        </div>
    </AuthenticatedLayout>
  );
}
