/**
 * Home/Landing Page
 * Shows PublicLanding for non-authenticated users
 * Shows AuthenticatedHome for logged-in users
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedHome from '@/components/home/AuthenticatedHome';
import { PublicLanding } from '@/components/home/PublicLanding';

export default function Home() {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show authenticated home if user is logged in
  if (user) {
    return <AuthenticatedHome />;
  }
  
  // Show public landing page for non-authenticated users
  return <PublicLanding />;
}
