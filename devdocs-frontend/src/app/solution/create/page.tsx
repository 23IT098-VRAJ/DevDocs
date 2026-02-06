/**
 * Create Solution Page
 * Form for submitting a new code solution
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SolutionForm } from '@/components/form/SolutionForm';
import { Home, ChevronRight, HelpCircle } from 'lucide-react';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';
import { GlassmorphicFooter } from '@/components/layout/GlassmorphicFooter';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import type { Solution } from '@/lib/types';

export default function CreateSolutionPage() {
  const { loading } = useRequireAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSuccess(solution: Solution) {
    router.push(`/solution/${solution.id}`);
  }

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

  return (
    <div className="min-h-screen bg-black">
      <GlassmorphicNavbar />
      
      <div className="pt-20 pb-32">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-[#07b9d5]">New Solution</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex-1 min-w-[300px]">
              <h1 className="text-white text-4xl font-black tracking-tight mb-2">
                Create New Solution
              </h1>
              <p className="text-white/60 text-base">
                Document your code snippet and share it with the team.
              </p>
            </div>
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5">
              <HelpCircle size={18} />
              Formatting Guide
            </button>
          </div>

          {/* Form */}
          <div className="backdrop-blur-2xl bg-black border border-white/20 rounded-2xl p-8 shadow-xl">
            <SolutionForm 
              mode="create" 
              onSuccess={handleSuccess}
              onSubmittingChange={setIsSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8 mb-8">
            <button 
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="solution-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black font-bold hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Solution
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <GlassmorphicFooter />
    </div>
  );
}
