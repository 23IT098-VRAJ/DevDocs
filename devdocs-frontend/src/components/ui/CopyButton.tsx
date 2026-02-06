'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * CopyButton Component
 * 
 * One-click copy to clipboard with visual feedback
 * Shows checkmark animation on successful copy
 */
export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      // Check if Clipboard API is available (requires HTTPS or localhost)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP or older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`group relative px-3 py-1.5 rounded-lg bg-black hover:bg-slate-900 border border-slate-600/50 hover:border-slate-500 transition-all duration-200 ${className}`}
      title="Copy to clipboard"
    >
      <div className="flex items-center gap-2">
        {copied ? (
          <>
            <svg className="w-4 h-4 text-emerald-400 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-medium text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Copy</span>
          </>
        )}
      </div>
    </button>
  );
}
