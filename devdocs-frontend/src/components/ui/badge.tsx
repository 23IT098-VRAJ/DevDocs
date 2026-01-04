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
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      success: 'bg-green-50 text-green-700 hover:bg-green-100',
      warning: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      error: 'bg-red-50 text-red-700 hover:bg-red-100',
      info: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
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
