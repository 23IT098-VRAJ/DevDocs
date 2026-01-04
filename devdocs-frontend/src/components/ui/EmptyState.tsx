/**
 * EmptyState Component
 * Delightful empty state illustrations with SVG animations
 */

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Type of empty state */
  variant?: 'search' | 'solutions' | 'activity' | 'generic';
  
  /** Title text */
  title?: string;
  
  /** Description text */
  description?: string;
  
  /** Optional action button */
  action?: React.ReactNode;
}

export function EmptyState({
  variant = 'generic',
  title = 'No results found',
  description = 'Try adjusting your search or filters',
  action,
  className,
  ...props
}: EmptyStateProps) {
  const illustrations = {
    search: (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto mb-6">
        <defs>
          <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Magnifying Glass */}
        <g className="animate-pulse">
          <circle cx="70" cy="70" r="35" fill="none" stroke="url(#searchGrad)" strokeWidth="6" opacity="0.3" />
          <circle cx="70" cy="70" r="30" fill="none" stroke="url(#searchGrad)" strokeWidth="4" />
          <line x1="95" y1="95" x2="120" y2="120" stroke="url(#searchGrad)" strokeWidth="6" strokeLinecap="round" />
        </g>
        
        {/* Question Mark */}
        <text x="70" y="80" textAnchor="middle" fill="url(#searchGrad)" fontSize="32" fontWeight="bold" opacity="0.5">
          ?
        </text>
        
        {/* Floating Dots */}
        <circle cx="130" cy="50" r="4" fill="#3b82f6" opacity="0.4">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="70" r="3" fill="#8b5cf6" opacity="0.4">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="90" r="5" fill="#06b6d4" opacity="0.4">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    
    solutions: (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto mb-6">
        <defs>
          <linearGradient id="solutionsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Empty Folder */}
        <g transform="translate(50, 60)">
          <path d="M0,20 L0,80 L100,80 L100,20 L60,20 L50,10 L0,10 Z" 
                fill="none" 
                stroke="url(#solutionsGrad)" 
                strokeWidth="4" 
                opacity="0.6" />
          
          {/* Animated Lines */}
          <line x1="20" y1="40" x2="80" y2="40" stroke="url(#solutionsGrad)" strokeWidth="3" opacity="0.3">
            <animate attributeName="x2" values="20;80;20" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="20" y1="55" x2="60" y2="55" stroke="url(#solutionsGrad)" strokeWidth="3" opacity="0.3">
            <animate attributeName="x2" values="20;60;20" dur="3.5s" repeatCount="indefinite" />
          </line>
        </g>
      </svg>
    ),
    
    activity: (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto mb-6">
        <defs>
          <linearGradient id="activityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        
        {/* Clock */}
        <circle cx="100" cy="100" r="50" fill="none" stroke="url(#activityGrad)" strokeWidth="4" opacity="0.6" />
        
        {/* Clock Hands */}
        <line x1="100" y1="100" x2="100" y2="70" stroke="url(#activityGrad)" strokeWidth="3" strokeLinecap="round">
          <animateTransform 
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="10s"
            repeatCount="indefinite" />
        </line>
        <line x1="100" y1="100" x2="120" y2="100" stroke="url(#activityGrad)" strokeWidth="2" strokeLinecap="round">
          <animateTransform 
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="3s"
            repeatCount="indefinite" />
        </line>
        
        {/* Center Dot */}
        <circle cx="100" cy="100" r="5" fill="url(#activityGrad)" />
        
        {/* Zzz */}
        <text x="150" y="60" fill="url(#activityGrad)" fontSize="20" opacity="0.5">
          Z
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </text>
        <text x="160" y="50" fill="url(#activityGrad)" fontSize="16" opacity="0.5">
          z
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </text>
      </svg>
    ),
    
    generic: (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto mb-6">
        <defs>
          <linearGradient id="genericGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        
        {/* Empty Box */}
        <rect x="60" y="60" width="80" height="80" 
              fill="none" 
              stroke="url(#genericGrad)" 
              strokeWidth="4" 
              rx="8" 
              opacity="0.6" />
        
        {/* Sparkle */}
        <g opacity="0.8">
          <line x1="100" y1="40" x2="100" y2="50" stroke="url(#genericGrad)" strokeWidth="2">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="95" y1="45" x2="105" y2="45" stroke="url(#genericGrad)" strokeWidth="2">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </line>
        </g>
      </svg>
    ),
  };

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)} {...props}>
      {illustrations[variant]}
      
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mb-6">{description}</p>
      
      {action && <div>{action}</div>}
    </div>
  );
}
