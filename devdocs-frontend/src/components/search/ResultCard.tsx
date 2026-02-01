/**
 * ResultCard Component
 * Displays individual search result with similarity score and code preview
 */

'use client';

import Link from 'next/link';
import { Card, Badge, ColorTag, CopyButton, LanguageIcon } from '@/components/ui';
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
  const solution = result.solution;
  const similarityPercent = Math.round(result.similarity * 100);
  const similarityLevel = getSimilarityLevel(result.similarity);
  const similarityColor = getSimilarityColor(result.similarity);

  return (
    <Link href={`/solution/${solution.id}`}>
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
              {solution.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {solution.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={similarityColor as any} size="lg">
              {similarityPercent}% Match
            </Badge>
            <span className="text-xs text-gray-500 font-medium">
              {similarityLevel}
            </span>
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-slate-900 rounded-md p-3 mb-3 overflow-hidden relative group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={solution.code} />
          </div>
          <pre className="text-sm text-slate-200 font-mono overflow-x-auto">
            <code>
              {showFullCode ? solution.code : truncateText(solution.code, 200)}
            </code>
          </pre>
          {!showFullCode && solution.code.length > 200 && (
            <p className="text-xs text-slate-400 mt-2">Click to view full code...</p>
          )}
        </div>

        {/* Footer: Language, Tags, Date */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <LanguageIcon language={solution.language} size="sm" />
            
            {solution.tags.slice(0, 4).map((tag) => (
              <ColorTag key={tag} tag={tag} size="sm" />
            ))}
            
            {solution.tags.length > 4 && (
              <span className="text-xs text-slate-400">
                +{solution.tags.length - 4} more
              </span>
            )}
          </div>
          
          <span className="text-xs text-gray-500">
            {formatDate(solution.created_at)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
