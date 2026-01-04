/**
 * Card Component
 * Container component with border, padding, and shadow.
 * Used to wrap content sections, solutions, stats, and search results.
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant affecting visual style */
  variant?: 'default' | 'elevated' | 'outlined';
  
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Make card clickable with hover effects */
  clickable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Card component for wrapping content sections.
 * 
 * @example
 * <Card>
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 * 
 * <Card variant="elevated" padding="lg" clickable onClick={handleClick}>
 *   Clickable card with shadow
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      clickable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base card styles
    const baseStyles = cn(
      'rounded-lg transition-all duration-200',
      'bg-slate-800 border-2 border-slate-700'
    );

    // Variant styles
    const variantStyles = {
      default: 'shadow-lg shadow-black/30',
      elevated: 'shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/50 border-l-4 border-l-blue-500/50',
      outlined: 'border-2 border-slate-600 shadow-md hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-500/30',
    };

    // Padding styles
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    // Clickable styles
    const clickableStyles = clickable
      ? cn(
          'cursor-pointer',
          'hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] hover:border-blue-500/70',
          'active:scale-[0.98]',
          'border-l-4 border-l-transparent hover:border-l-blue-500'
        )
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          clickableStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * CardHeader - Top section of card with title and optional actions
 */
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - Main heading for card
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold text-gray-900', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription - Subtitle or description text
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

/**
 * CardContent - Main content area of card
 */
export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

/**
 * CardFooter - Bottom section with actions or metadata
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-gray-100', className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
