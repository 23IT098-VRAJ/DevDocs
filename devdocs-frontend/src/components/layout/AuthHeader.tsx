/**
 * Minimal Auth Header
 * Simple logo and app name for authentication pages
 */

import Link from 'next/link';

export function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6">
      <Link href="/" className="inline-flex items-center space-x-2 hover:opacity-90 transition-opacity">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-white font-bold shadow-lg shadow-cyan-400/30">
          D
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
          DevDocs
        </span>
      </Link>
    </header>
  );
}
