import React, { useState } from 'react'
import { ReviewComment as ReviewCommentType } from '../../types'
import { SeverityBadge } from '../SeverityBadge/SeverityBadge'

interface ReviewCommentProps {
  comment: ReviewCommentType
  className?: string
}

export const ReviewComment: React.FC<ReviewCommentProps> = ({ comment, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const confidenceColor =
    comment.aiConfidence >= 0.9
      ? 'text-success-600'
      : comment.aiConfidence >= 0.7
        ? 'text-warning-600'
        : 'text-danger-600'

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={comment.severity} />
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {comment.category}
          </span>
          <span className="text-xs text-gray-500">Line {comment.lineNumber}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">AI Confidence:</span>
          <span className={`text-xs font-semibold ${confidenceColor}`}>
            {(comment.aiConfidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-800 leading-relaxed mb-3">{comment.message}</p>

      {comment.suggestion && (
        <div className="mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            aria-expanded={isExpanded}
            aria-controls={`suggestion-${comment.id}`}
          >
            <span>{isExpanded ? '▼' : '▶'}</span>
            <span>View Suggestion</span>
          </button>
          {isExpanded && (
            <div
              id={`suggestion-${comment.id}`}
              className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                {comment.suggestion}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {new Date(comment.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
