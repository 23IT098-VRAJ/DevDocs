'use client';

import React from 'react';
import GlassmorphicNavbar from './GlassmorphicNavbar';
import { GlassmorphicFooter } from './GlassmorphicFooter';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <GlassmorphicNavbar />
      
      {/* Main Content with padding to account for fixed navbar */}
      <main className="flex-1 pt-24 px-4">
        {children}
      </main>

      <GlassmorphicFooter />
    </div>
  );
}
