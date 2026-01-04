/**
 * Header Component
 * Top navigation bar with logo, links, and global search
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchBar } from '@/components/form/SearchBar';
import { Button, CommandPalette, useCommandPalette } from '@/components/ui';
import { APP_NAME } from '@/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

interface NavLink {
  href: string;
  label: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const NAV_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/solution', label: 'Browse' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen, open, close } = useCommandPalette();

  // Check if link is active
  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <>
      <CommandPalette isOpen={isOpen} onClose={close} />
      <header className="sticky top-0 z-50 w-full border-b-2 border-transparent bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-cyan-500/20 backdrop-blur-lg shadow-lg shadow-blue-500/5">
      <div className="bg-slate-800/90 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              D
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-violet-500 after:rounded-full'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search & CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={open}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-slate-500 rounded-lg transition-all text-slate-400 hover:text-slate-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">Search</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-slate-600 border border-slate-500 rounded">⌘K</kbd>
            </button>
            <Link href="/solution/create">
              <Button variant="primary" size="sm" className="animate-pulse hover:animate-none">
                + New Solution
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-blue-400 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-slate-700/50 animate-in slide-in-from-top">
            {/* Mobile Navigation Links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <div className="px-4 pt-2">
              <button
                onClick={open}
                className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm">Search (⌘K)</span>
              </button>
            </div>

            {/* Mobile CTA */}
            <div className="px-4">
              <Link href="/solution/create" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" fullWidth>
                  + New Solution
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
    </>
  );
}
