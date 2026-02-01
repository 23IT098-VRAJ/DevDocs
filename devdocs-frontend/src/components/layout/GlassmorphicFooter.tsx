/**
 * Glassmorphic Footer Component
 * Matches pure black + cyan theme with glassmorphic design
 */

'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function GlassmorphicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/10">
      {/* Cyan gradient glow at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#07b9d5] to-transparent"></div>
      
      <div className="backdrop-blur-xl bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#07b9d5] to-[#059ab3] flex items-center justify-center shadow-lg shadow-[#07b9d5]/50">
                  <span className="text-white text-xl font-bold">D</span>
                </div>
                <span className="text-xl font-bold text-white">DevDocs</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-powered semantic code search. Store, search, and discover solutions with intelligent similarity matching.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Made with</span>
                <Heart size={14} className="text-red-500 fill-red-500" />
                <span>by developers, for developers</span>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#07b9d5] to-[#059ab3] rounded-full"></div>
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    AI Search
                  </Link>
                </li>
                <li>
                  <Link href="/solution" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Browse Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/solution/create" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Create Solution
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#07b9d5] to-[#059ab3] rounded-full"></div>
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200 inline-flex items-center gap-1.5">
                    Documentation
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200 inline-flex items-center gap-1.5">
                    API Status
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200 inline-flex items-center gap-1.5">
                    Changelog
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <Link href="/profile" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#07b9d5] to-[#059ab3] rounded-full"></div>
                Connect
              </h3>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/privacy" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-slate-400 hover:text-[#07b9d5] transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#07b9d5]/20 hover:border-[#07b9d5]/50 transition-all duration-300 group"
                  aria-label="GitHub"
                >
                  <Github size={16} className="text-slate-400 group-hover:text-[#07b9d5] transition-colors" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#07b9d5]/20 hover:border-[#07b9d5]/50 transition-all duration-300 group"
                  aria-label="Twitter"
                >
                  <Twitter size={16} className="text-slate-400 group-hover:text-[#07b9d5] transition-colors" />
                </a>
                <a
                  href="mailto:contact@devdocs.dev"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#07b9d5]/20 hover:border-[#07b9d5]/50 transition-all duration-300 group"
                  aria-label="Email"
                >
                  <Mail size={16} className="text-slate-400 group-hover:text-[#07b9d5] transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-sm text-slate-500">
                © {currentYear} DevDocs. All rights reserved.
              </p>

              {/* Tech Stack Badges */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:bg-[#07b9d5]/10 hover:border-[#07b9d5]/50 hover:text-[#07b9d5] transition-all duration-300 hover:scale-105"
                >
                  ⚡ Next.js 15
                </a>
                <a
                  href="https://fastapi.tiangolo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:bg-[#07b9d5]/10 hover:border-[#07b9d5]/50 hover:text-[#07b9d5] transition-all duration-300 hover:scale-105"
                >
                  🚀 FastAPI
                </a>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:bg-[#07b9d5]/10 hover:border-[#07b9d5]/50 hover:text-[#07b9d5] transition-all duration-300 hover:scale-105"
                >
                  💾 Supabase
                </a>
                <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#07b9d5]/20 to-[#059ab3]/20 border border-[#07b9d5]/30 text-xs font-medium text-[#07b9d5]">
                  🤖 AI-Powered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
