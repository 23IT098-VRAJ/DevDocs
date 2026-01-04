/**
 * Spinner Component
 * Loading indicator for async operations.
 * Used during data fetching, form submissions, and search operations.
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
  
  /** Optional loading text */
  label?: string;
  
  /** Full screen overlay spinner */
  fullscreen?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Spinner component for loading states.
 * 
 * @example
 * <Spinner />
 * <Spinner size="lg" label="Loading solutions..." />
 * <Spinner variant="white" /> // For dark backgrounds
 * <Spinner fullscreen /> // Full screen overlay
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      label,
      fullscreen = false,
      className,
      ...props
    },
    ref
  ) => {
    // Size mappings for spinner circle
    const sizeStyles = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-2',
      lg: 'h-12 w-12 border-3',
      xl: 'h-16 w-16 border-4',
    };

    // Color variants
    const variantStyles = {
      primary: 'border-blue-600 border-t-transparent',
      secondary: 'border-gray-600 border-t-transparent',
      white: 'border-white border-t-transparent',
    };

    // Label text size
    const labelSizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const spinner = (
      <div
        className={cn(
          'inline-flex flex-col items-center justify-center gap-2',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Spinning circle */}
        <div
          className={cn(
            'animate-spin rounded-full',
            sizeStyles[size],
            variantStyles[variant]
          )}
          role="status"
          aria-label={label || 'Loading'}
        />

        {/* Optional label */}
        {label && (
          <p
            className={cn(
              'font-medium text-gray-700',
              labelSizeStyles[size]
            )}
          >
            {label}
          </p>
        )}

        {/* Screen reader only text */}
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );

    // Fullscreen overlay variant
    if (fullscreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          {spinner}
        </div>
      );
    }

    return spinner;
  }
);

Spinner.displayName = 'Spinner';

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * SpinnerOverlay - Spinner with semi-transparent overlay for loading states
 * Use this when you want to show loading over existing content
 * 
 * @example
 * <div className="relative">
 *   <YourContent />
 *   {isLoading && <SpinnerOverlay />}
 * </div>
 */
export const SpinnerOverlay = forwardRef<HTMLDivElement, Omit<SpinnerProps, 'fullscreen'>>(
  ({ size = 'lg', variant = 'primary', label, className, ...props }, ref) => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
      <Spinner
        ref={ref}
        size={size}
        variant={variant}
        label={label}
        className={className}
        {...props}
      />
    </div>
  )
);

SpinnerOverlay.displayName = 'SpinnerOverlay';
