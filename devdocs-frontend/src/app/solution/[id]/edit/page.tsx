/**
 * Edit Solution Page
 * Update existing solution with pre-filled form
 */

'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSolution } from '@/hooks/useSolutions';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { SolutionForm } from '@/components/form/SolutionForm';
import { Card, Spinner } from '@/components/ui';
import { Home, ChevronRight, HelpCircle } from 'lucide-react';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';

interface EditSolutionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSolutionPage({ params }: EditSolutionPageProps) {
  const { id } = use(params);
  const { loading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { data: solution, isLoading, error } = useSolution(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  function handleSuccess() {
    router.push(`/solution/${id}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <GlassmorphicNavbar />
        <div className="pt-24 px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-black">
        <GlassmorphicNavbar />
        <div className="pt-24 px-4 py-8 max-w-7xl mx-auto">
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h2>
          <p className="text-gray-600 mb-6">Cannot edit a solution that doesn't exist.</p>
          {/* <Link href="/dashboard">
            <button className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Back to Dashboard</button>
          </Link> */}
          <Link href="/">
            <button className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Back to Home</button>
          </Link>
        </Card>
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
            <Link href="/solution" className="text-white/60 hover:text-white transition-colors">
              Solutions
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <Link href={`/solution/${id}`} className="text-white/60 hover:text-white transition-colors truncate max-w-[150px]">
              {solution.title}
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-[#07b9d5]">Edit</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex-1 min-w-[300px]">
              <h1 className="text-white text-4xl font-black tracking-tight mb-2">
                Edit Solution
              </h1>
              <p className="text-white/60 text-base">
                Update your code snippet and documentation.
              </p>
            </div>
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5">
              <HelpCircle size={18} />
              Formatting Guide
            </button>
          </div>

          {/* Form */}
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
            <SolutionForm
              solution={solution}
              mode="edit"
              onSuccess={handleSuccess}
              onSubmittingChange={setIsSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8 mb-8">
            <button 
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Solution
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
