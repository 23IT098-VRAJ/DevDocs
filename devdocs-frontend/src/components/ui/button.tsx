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
      'font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rounded-lg'
    );

    // Variant-specific styles
    const variantStyles = {
      primary: cn(
        'bg-blue-600 text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500',
        'disabled:hover:bg-blue-600'
      ),
      secondary: cn(
        'bg-gray-600 text-white',
        'hover:bg-gray-700',
        'focus:ring-gray-500',
        'disabled:hover:bg-gray-600'
      ),
      outline: cn(
        'border-2 border-gray-300 bg-transparent text-gray-700',
        'hover:bg-gray-50',
        'focus:ring-gray-500',
        'disabled:hover:bg-transparent'
      ),
      ghost: cn(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100',
        'focus:ring-gray-500',
        'disabled:hover:bg-transparent'
      ),
      destructive: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700',
        'focus:ring-red-500',
        'disabled:hover:bg-red-600'
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
