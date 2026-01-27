/**
 * Button Component
 * Reusable button with multiple variants and sizes.
 * Used throughout the app for actions, navigation, and form submissions.
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state - shows spinner and disables button */
  isLoading?: boolean;
  
  /** Full width button */
  fullWidth?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Button component with support for multiple variants and sizes.
 * 
 * @example
 * <Button variant="primary" onClick={handleSave}>Save Solution</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <Button isLoading disabled>Saving...</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles applied to all buttons
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rounded-lg',
      'hover:scale-105 active:scale-95',
      'transform-gpu'
    );

    // Variant-specific styles
    const variantStyles = {
      primary: cn(
        'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-400/30',
        'hover:from-cyan-500 hover:to-cyan-700 hover:shadow-2xl hover:shadow-cyan-400/60 hover:-translate-y-0.5',
        'focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:hover:from-cyan-400 disabled:hover:to-cyan-600 disabled:shadow-lg disabled:hover:translate-y-0 disabled:hover:scale-100'
      ),
      secondary: cn(
        'bg-slate-700 text-slate-100 border border-slate-600',
        'hover:bg-slate-600 hover:border-slate-500',
        'focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:hover:bg-slate-700'
      ),
      outline: cn(
        'border-2 border-slate-600 bg-transparent text-slate-300',
        'hover:bg-slate-800 hover:border-blue-500 hover:text-blue-400',
        'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:hover:bg-transparent disabled:hover:border-slate-600'
      ),
      ghost: cn(
        'bg-transparent text-slate-300',
        'hover:bg-slate-800 hover:text-blue-400',
        'focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:hover:bg-transparent'
      ),
      destructive: cn(
        'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
        'hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/40',
        'focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:hover:from-red-500 disabled:hover:to-red-600'
      ),
    };

    // Size-specific styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
