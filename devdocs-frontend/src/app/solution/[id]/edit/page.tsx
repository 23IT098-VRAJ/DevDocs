/**
 * Edit Solution Page
 * Update existing solution with pre-filled form
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSolution } from '@/hooks/useSolutions';
import { SolutionForm } from '@/components/form/SolutionForm';
import { Card, Spinner } from '@/components/ui';

interface EditSolutionPageProps {
  params: { id: string };
}

export default function EditSolutionPage({ params }: EditSolutionPageProps) {
  const router = useRouter();
  const { data: solution, isLoading, error } = useSolution(params.id);

  function handleSuccess() {
    router.push(`/solution/${params.id}`);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h2>
          <p className="text-gray-600 mb-6">Cannot edit a solution that doesn't exist.</p>
          <Link href="/dashboard">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Back to Dashboard</button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/solution/${params.id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Solution
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Edit Solution</h1>
        <p className="text-lg text-gray-600">Update your code solution</p>
      </div>

      {/* Form */}
      <Card className="p-8">
        <SolutionForm mode="edit" solution={solution} onSuccess={handleSuccess} />
      </Card>
    </div>
  );
}
