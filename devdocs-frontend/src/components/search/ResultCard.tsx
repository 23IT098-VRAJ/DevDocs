/**
 * ResultCard Component
 * Displays individual search result with similarity score and code preview
 */

'use client';

import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { formatDate, truncateText, getSimilarityColor, getSimilarityLevel } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface ResultCardProps {
  /**
   * Search result data
   */
  result: SearchResult;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Whether to show full code or truncated (default: truncated)
   */
  showFullCode?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ResultCard({
  result,
  className = '',
  showFullCode = false,
}: ResultCardProps) {
  const similarityPercent = Math.round(result.similarity_score * 100);
  const similarityLevel = getSimilarityLevel(result.similarity_score);
  const similarityColor = getSimilarityColor(result.similarity_score);

  return (
    <Link href={`/solution/${result.id}`}>
      <Card
        variant="outlined"
        padding="md"
        clickable
        className={`hover:shadow-md transition-shadow ${className}`}
      >
        {/* Header: Title and Similarity */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {result.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {result.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge variant={similarityColor} size="lg">
              {similarityPercent}% Match
            </Badge>
            <span className="text-xs text-gray-500 font-medium">
              {similarityLevel}
            </span>
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-gray-50 rounded-md p-3 mb-3 overflow-hidden">
          <pre className="text-sm text-gray-800 font-mono overflow-x-auto">
            <code>
              {showFullCode ? result.code : truncateText(result.code, 200)}
            </code>
          </pre>
          {!showFullCode && result.code.length > 200 && (
            <p className="text-xs text-gray-500 mt-2">Click to view full code...</p>
          )}
        </div>

        {/* Footer: Language, Tags, Date */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="info" size="sm">
              {result.language}
            </Badge>
            
            {result.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
            
            {result.tags.length > 4 && (
              <span className="text-xs text-gray-500">
                +{result.tags.length - 4} more
              </span>
            )}
          </div>
          
          <span className="text-xs text-gray-500">
            {formatDate(result.created_at)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
