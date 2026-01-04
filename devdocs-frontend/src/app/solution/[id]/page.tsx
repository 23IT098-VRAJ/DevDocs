/**
 * Solution Detail Page
 * Full solution display with code, metadata, and actions
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSolution, useDeleteSolution } from '@/hooks/useSolutions';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface SolutionDetailPageProps {
  params: { id: string };
}

export default function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const router = useRouter();
  const { data: solution, isLoading, error } = useSolution(params.id);
  const deleteMutation = useDeleteSolution();

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this solution? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(params.id);
      router.push('/dashboard');
    } catch (err) {
      alert('Failed to delete solution. Please try again.');
    }
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
          <p className="text-gray-600 mb-6">The solution you're looking for doesn't exist or has been deleted.</p>
          <Link href="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{solution.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Created {formatDate(solution.created_at)}</span>
              {solution.updated_at !== solution.created_at && (
                <span>• Updated {formatDate(solution.updated_at)}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/solution/${params.id}/edit`}>
              <Button variant="secondary" size="sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Language Badge */}
      <div className="mb-6">
        <Badge variant="info">{solution.language}</Badge>
      </div>

      {/* Description */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{solution.description}</p>
      </Card>

      {/* Code */}
      <Card className="p-0 mb-6 overflow-hidden">
        <div className="bg-gray-800 px-6 py-3 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">Code</h2>
          <button
            onClick={() => navigator.clipboard.writeText(solution.code)}
            className="px-3 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            Copy
          </button>
        </div>
        <pre className="p-6 overflow-x-auto bg-gray-900">
          <code className="text-sm text-gray-100 font-mono">{solution.code}</code>
        </pre>
      </Card>

      {/* Tags */}
      {solution.tags && solution.tags.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {solution.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
