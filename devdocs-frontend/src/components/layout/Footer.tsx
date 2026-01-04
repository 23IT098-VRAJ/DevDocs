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
      { href: '/', label: 'About Project' },
      { href: '/', label: 'Tech Stack' },
      { href: '/', label: 'Contact' },
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
                D
              </div>
              <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-600">
              Semantic code search powered by AI. Store, search, and discover code solutions with intelligent similarity matching.
            </p>
            <p className="text-xs text-gray-500">
              Version {APP_VERSION}
            </p>
          </div>

          {/* Footer Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
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
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © {currentYear} {APP_NAME}. Built with Next.js, FastAPI, and PostgreSQL.
            </p>

            {/* Tech Stack Links */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Next.js
              </a>
              <span>•</span>
              <a
                href="https://fastapi.tiangolo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                FastAPI
              </a>
              <span>•</span>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Supabase
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
