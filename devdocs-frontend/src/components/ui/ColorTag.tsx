/**
 * ColorTag Component
 * Gradient color-coded tags with hover effects
 * Automatically selects colors based on tag content
 */

import { HTMLAttributes } from 'react';
import { getTagClassName } from '@/lib/tagColors';

interface ColorTagProps extends HTMLAttributes<HTMLSpanElement> {
  tag: string;
  size?: 'sm' | 'md';
}

export function ColorTag({ tag, size = 'sm', className = '', ...props }: ColorTagProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const colorClassName = getTagClassName(tag);

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 ${colorClassName} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {tag}
    </span>
  );
}
