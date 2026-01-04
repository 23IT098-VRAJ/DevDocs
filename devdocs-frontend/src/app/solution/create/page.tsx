/**
 * Create Solution Page
 * Form for submitting a new code solution
 */

'use client';

import { useRouter } from 'next/navigation';
import { SolutionForm } from '@/components/form/SolutionForm';
import { Card } from '@/components/ui';

export default function CreateSolutionPage() {
  const router = useRouter();

  function handleSuccess(solutionId: string) {
    router.push(`/solution/${solutionId}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-3">Save New Solution</h1>
        <p className="text-lg text-slate-300">
          Add a code snippet to your knowledge base. Takes just 30 seconds.
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-6 mb-8 bg-slate-800/50 border-l-4 border-blue-500 shadow-xl shadow-blue-500/10 backdrop-blur-sm">
        <div className="flex gap-3">
          <div className="shrink-0">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 mb-1">How it works</h3>
            <p className="text-sm text-slate-300">
              Your code will be processed with AI to generate semantic embeddings. This allows you to search using natural language and find solutions by meaning, not just keywords.
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card className="p-8 shadow-2xl shadow-black/40">
        <SolutionForm mode="create" onSuccess={handleSuccess} />
      </Card>
    </div>
  );
}
