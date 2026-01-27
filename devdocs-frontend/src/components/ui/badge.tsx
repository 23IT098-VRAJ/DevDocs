/**
 * Badge Component
 * Small colored labels for tags, categories, and status indicators.
 * Used for programming languages, similarity scores, and general tags.
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant for different use cases */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Make badge clickable/removable */
  clickable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Badge component for labels and tags.
 * 
 * @example
 * <Badge>Python</Badge>
 * <Badge variant="success">94%</Badge>
 * <Badge variant="warning" size="sm">Beta</Badge>
 * <Badge variant="outline" clickable onClick={remove}>Remove</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      clickable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base badge styles
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-1',
      'font-medium rounded-full transition-colors duration-200',
      'whitespace-nowrap'
    );

    // Variant styles (matching SIMILARITY_COLORS from constants)
    const variantStyles = {
      default: 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-400/30',
      success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      error: 'bg-red-500/20 text-red-400 border border-red-500/30',
      info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      outline: 'border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800 hover:border-blue-500',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    // Clickable styles
    const clickableStyles = clickable
      ? 'cursor-pointer hover:opacity-80 active:scale-95'
      : '';

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          clickableStyles,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
