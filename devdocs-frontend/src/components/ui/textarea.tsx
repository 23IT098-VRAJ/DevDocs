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
    // Generate unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate character count
    const currentLength = value ? String(value).length : 0;

    // Base textarea styles
    const textareaStyles = cn(
      'px-4 py-3 rounded-lg border transition-colors duration-200',
      'text-base text-gray-900 placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
      'resize-y', // Allow vertical resizing only
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
        {/* Label and character count */}
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-sm font-medium text-gray-700"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {showCount && (
            <span className="text-xs text-gray-500">
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

Textarea.displayName = 'Textarea';
