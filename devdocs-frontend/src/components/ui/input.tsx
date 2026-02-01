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
    // Use provided ID only (don't generate random IDs for SSR compatibility)
    const inputId = id;

    // Base input styles
    const inputStyles = cn(
      'px-4 py-2 rounded-lg border transition-all duration-200',
      'text-base text-slate-50 placeholder:text-slate-400',
      'bg-black border-slate-600',
      'focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400',
      'hover:bg-slate-900',
      'disabled:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
      // Error state
      hasError
        ? 'border-red-500 focus:ring-red-400 focus:border-red-400'
        : '',
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
            className="text-sm font-medium text-slate-200"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input ref={ref} id={inputId} className={inputStyles} {...props} />

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <p
            className={cn(
              'text-sm',
              hasError || errorMessage ? 'text-red-400' : 'text-slate-400'
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
