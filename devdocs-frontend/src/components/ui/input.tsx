/**
 * Input Component
 * Text input field with validation states and accessibility support.
 * Used in forms, search bars, and filter inputs.
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state - shows red border */
  hasError?: boolean;
  
  /** Full width input */
  fullWidth?: boolean;
  
  /** Optional label */
  label?: string;
  
  /** Optional helper text */
  helperText?: string;
  
  /** Optional error message */
  errorMessage?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Input component with validation states and accessibility.
 * 
 * @example
 * <Input placeholder="Search solutions..." />
 * <Input label="Title" hasError errorMessage="Title is required" />
 * <Input type="email" disabled />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      hasError = false,
      fullWidth = false,
      label,
      helperText,
      errorMessage,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input styles
    const inputStyles = cn(
      'px-4 py-2 rounded-lg border transition-colors duration-200',
      'text-base text-gray-900 placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
      // Error state
      hasError
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      // Width
      fullWidth ? 'w-full' : '',
      className
    );

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input ref={ref} id={inputId} className={inputStyles} {...props} />

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <p
            className={cn(
              'text-sm',
              hasError || errorMessage ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
