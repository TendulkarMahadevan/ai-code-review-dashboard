import React, { useMemo } from 'react'
import { FileDiff, ReviewComment as ReviewCommentType } from '../../types'
import { getDiffLineClass, getDiffLineSymbol } from '../../utils/diffHelpers'
import { ReviewComment } from '../ReviewComment/ReviewComment'

interface DiffViewerProps {
  diff: FileDiff
  comments: ReviewCommentType[]
  className?: string
}

const DiffLine: React.FC<{
  line: FileDiff['hunks'][0]['lines'][0]
  hasComment: boolean
  comments: ReviewCommentType[]
}> = React.memo(({ line, hasComment, comments }) => {
  const lineComments = comments.filter(c => c.lineNumber === line.newLineNumber)

  return (
    <>
      <div className={`flex ${getDiffLineClass(line.type)}`}>
        <div className="w-16 flex-shrink-0 text-right pr-3 text-xs text-gray-500 select-none font-mono">
          {line.type !== 'header' && (
            <>
              {line.oldLineNumber && <span className="inline-block w-7">{line.oldLineNumber}</span>}
              {!line.oldLineNumber && <span className="inline-block w-7"></span>}
              <span className="mx-1">|</span>
              {line.newLineNumber && <span className="inline-block w-7">{line.newLineNumber}</span>}
              {!line.newLineNumber && <span className="inline-block w-7"></span>}
            </>
          )}
        </div>
        <div className="flex-1 px-4 py-1 font-mono text-sm overflow-x-auto">
          {line.type !== 'header' && (
            <span className="mr-2 text-gray-500 select-none">
              {getDiffLineSymbol(line.type)}
            </span>
          )}
          <span className={line.type === 'header' ? 'text-gray-600' : ''}>{line.content}</span>
          {hasComment && (
            <span className="ml-2 text-xs text-danger-600 font-semibold" aria-label="Has comment">
              💬
            </span>
          )}
        </div>
      </div>
      {lineComments.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="space-y-3">
            {lineComments.map(comment => (
              <ReviewComment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </>
  )
})

DiffLine.displayName = 'DiffLine'

export const DiffViewer: React.FC<DiffViewerProps> = ({ diff, comments, className = '' }) => {
  const statusBadge = useMemo(() => {
    const statusColors = {
      added: 'bg-green-100 text-green-800 border-green-300',
      modified: 'bg-blue-100 text-blue-800 border-blue-300',
      deleted: 'bg-red-100 text-red-800 border-red-300',
      renamed: 'bg-purple-100 text-purple-800 border-purple-300',
    }

    return (
      <span
        className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusColors[diff.status]}`}
      >
        {diff.status}
      </span>
    )
  }, [diff.status])

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 font-mono">{diff.fileName}</h2>
          {statusBadge}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-600 font-medium">+{diff.additions} additions</span>
          <span className="text-red-600 font-medium">-{diff.deletions} deletions</span>
          {diff.language && (
            <span className="text-gray-600">
              Language: <span className="font-medium">{diff.language}</span>
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {diff.hunks.map((hunk, hunkIndex) => (
          <div key={hunkIndex} className="border-b border-gray-200 last:border-b-0">
            {hunk.lines.map((line, lineIndex) => (
              <DiffLine
                key={lineIndex}
                line={line}
                hasComment={!!line.hasComment}
                comments={comments}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
