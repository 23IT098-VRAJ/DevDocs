'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { CopyButton } from './CopyButton';

// Import common language support
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';

interface CodePreviewProps {
  code: string;
  language: string;
  className?: string;
}

/**
 * CodePreview Component
 * 
 * Real-time syntax highlighting preview using PrismJS
 * Supports 15+ programming languages with automatic highlighting
 * 
 * Features:
 * - Line numbers
 * - Syntax highlighting
 * - Dark theme (prism-tomorrow)
 * - Auto language detection support
 */
export function CodePreview({ code, language, className = '' }: CodePreviewProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  // Map common language names to Prism language keys
  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    js: 'javascript',
    typescript: 'typescript',
    ts: 'typescript',
    python: 'python',
    py: 'python',
    java: 'java',
    go: 'go',
    rust: 'rust',
    rs: 'rust',
    sql: 'sql',
    bash: 'bash',
    shell: 'bash',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    markdown: 'markdown',
    md: 'markdown',
    css: 'css',
    scss: 'scss',
    jsx: 'jsx',
    tsx: 'tsx',
  };

  const prismLanguage = languageMap[language.toLowerCase()] || 'javascript';

  if (!code.trim()) {
    return (
      <div className={`rounded-lg bg-black border border-slate-700 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32 text-slate-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <p className="text-sm">Code preview will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-black border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-medium text-slate-400 ml-2">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Live Preview</span>
          <CopyButton text={code} />
        </div>
      </div>

      {/* Code Block */}
      <div className="relative overflow-x-auto">
        <pre className="m-0! p-4! bg-black! text-sm leading-relaxed">
          <code ref={codeRef} className={`language-${prismLanguage}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
