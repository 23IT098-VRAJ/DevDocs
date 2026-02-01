/**
 * SolutionCard Component
 * Displays solution summary with actions (view, edit, delete)
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Badge, Button } from '@/components/ui';
import { useDeleteSolution } from '@/hooks';
import { formatDate, getRelativeTime, truncateText } from '@/lib/utils';
import type { Solution } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface SolutionCardProps {
  /**
   * Solution data
   */
  solution: Solution;
  
  /**
   * Whether to show action buttons (default: true)
   */
  showActions?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Callback after successful deletion
   */
  onDelete?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SolutionCard({
  solution,
  showActions = true,
  className = '',
  onDelete,
}: SolutionCardProps) {
  const router = useRouter();
  const deleteSolution = useDeleteSolution();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle delete
  async function handleDelete() {
    try {
      await deleteSolution.mutateAsync(solution.id);
      setShowDeleteConfirm(false);
      
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete solution:', error);
      alert('Failed to delete solution. Please try again.');
    }
  }

  return (
    <Card
      variant="outlined"
      padding="md"
      className={`hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header: Title and Language */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <Link 
          href={`/solution/${solution.id}`}
          className="flex-1 min-w-0 hover:text-cyan-400 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {solution.title}
          </h3>
        </Link>
        
        <Badge variant="info" size="md">
          {solution.language}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {truncateText(solution.description, 150)}
      </p>

      {/* Code Preview */}
      {solution.code && (
        <div className="bg-gray-50 rounded-md p-3 mb-4 overflow-hidden">
          <pre className="text-xs text-gray-700 font-mono overflow-x-auto">
            <code>{truncateText(solution.code, 100)}</code>
          </pre>
        </div>
      )}

      {/* Tags */}
      {solution.tags && solution.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {solution.tags.slice(0, 5).map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
          {solution.tags.length > 5 && (
            <span className="text-xs text-gray-500">
              +{solution.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Footer: Date and Actions */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200">
        <div className="flex flex-col text-xs text-gray-500">
          <span>Created {getRelativeTime(solution.created_at)}</span>
          {solution.updated_at !== solution.created_at && (
            <span className="text-gray-400">
              Updated {getRelativeTime(solution.updated_at)}
            </span>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <Link href={`/solution/${solution.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            
            <Link href={`/solution/${solution.id}/edit`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  isLoading={deleteSolution.isPending}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteSolution.isPending}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}