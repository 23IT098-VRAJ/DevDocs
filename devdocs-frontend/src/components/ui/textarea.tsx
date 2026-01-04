/**
 * Textarea Component
 * Multi-line text input for descriptions and code snippets.
 * Supports validation states, character counting, and auto-resize.
 */

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state - shows red border */
  hasError?: boolean;
  
  /** Full width textarea */
  fullWidth?: boolean;
  
  /** Optional label */
  label?: string;
  
  /** Optional helper text */
  helperText?: string;
  
  /** Optional error message */
  errorMessage?: string;
  
  /** Show character count */
  showCount?: boolean;
  
  /** Maximum character count for counter */
  maxLength?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Textarea component for multi-line text input.
 * 
 * @example
 * <Textarea placeholder="Enter description..." rows={4} />
 * <Textarea label="Code" showCount maxLength={5000} />
 * <Textarea hasError errorMessage="Description is too short" />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      hasError = false,
      fullWidth = true,
      label,
      helperText,
      errorMessage,
      showCount = false,
      maxLength,
      className,
      id,
      value,
      ...props
    },
    ref
  ) => {
    // Use provided ID only (don't generate random IDs for SSR compatibility)
    const textareaId = id;

    // Calculate character count
    const currentLength = value ? String(value).length : 0;

    // Base textarea styles
    const textareaStyles = cn(
      'px-4 py-3 rounded-lg border transition-all duration-200',
      'text-base text-slate-50 placeholder:text-slate-400',
      'bg-slate-800 border-slate-600',
      'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
      'hover:bg-slate-700/50',
      'disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50',
      'resize-y', // Allow vertical resizing only
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
        {/* Label and character count */}
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-sm font-medium text-slate-200"
            >
              {label}
              {props.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          )}
          
          {showCount && (
            <span className="text-xs text-slate-400">
              {currentLength}
              {maxLength && `/${maxLength}`}
            </span>
          )}
        </div>

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaStyles}
          maxLength={maxLength}
          value={value}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
