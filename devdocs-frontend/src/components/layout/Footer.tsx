/**
 * Footer Component
 * Bottom section with links, copyright, and metadata
 */

'use client';

import Link from 'next/link';
import { APP_NAME, APP_VERSION } from '@/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/search', label: 'Search' },
      { href: '/solution', label: 'Browse Solutions' },
      { href: '/solution/create', label: 'Create Solution' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: 'https://github.com', label: 'GitHub', external: true },
      { href: 'https://docs.github.com', label: 'Documentation', external: true },
      { href: '/api/health', label: 'API Status', external: true },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About Project' },
      { href: '/tech-stack', label: 'Tech Stack' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-transparent bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-cyan-500/20">
      <div className="bg-slate-800/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold shadow-lg shadow-blue-500/30">
                D
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{APP_NAME}</span>
            </div>
            <p className="text-sm text-slate-400">
              Semantic code search powered by AI. Store, search, and discover code solutions with intelligent similarity matching.
            </p>
            <p className="text-xs text-slate-500">
              Version {APP_VERSION}
            </p>
          </div>

          {/* Footer Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-200 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                      >
                        {link.label}
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-slate-400">
              © {currentYear} {APP_NAME}. Built with Next.js, FastAPI, and PostgreSQL.
            </p>

            {/* Tech Stack Badges */}
            <div className="flex items-center gap-2">
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 text-xs font-medium text-slate-200 hover:from-blue-500 hover:to-violet-500 hover:border-blue-400 hover:text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                ⚡ Next.js
              </a>
              <a
                href="https://fastapi.tiangolo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 text-xs font-medium text-slate-200 hover:from-emerald-500 hover:to-cyan-500 hover:border-emerald-400 hover:text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105"
              >
                🚀 FastAPI
              </a>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 text-xs font-medium text-slate-200 hover:from-violet-500 hover:to-fuchsia-500 hover:border-violet-400 hover:text-white hover:shadow-lg hover:shadow-violet-500/50 transition-all hover:scale-105"
              >
                💾 Supabase
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
