import React, { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { FileDiff, DiffLine as DiffLineType, ReviewComment as ReviewCommentType } from '../../types'
import { getDiffLineClass, getDiffLineSymbol } from '../../utils/diffHelpers'
import { tokenizeLine } from '../../utils/highlighter'
import { useHighlighter } from '../../hooks/useHighlightedLines'
import { ReviewComment } from '../ReviewComment/ReviewComment'

interface DiffViewerProps {
  diff: FileDiff
  comments: ReviewCommentType[]
  className?: string
}

/** Diffs with more rows than this are windowed instead of fully rendered. */
export const VIRTUALIZE_THRESHOLD = 300
const ESTIMATED_ROW_HEIGHT = 28

const EMPTY_COMMENTS: ReviewCommentType[] = []

interface DiffRow {
  line: DiffLineType
  key: string
}

const DiffLineContent: React.FC<{
  content: string
  language?: string
  highlighted: boolean
}> = ({ content, language, highlighted }) => {
  const tokens = highlighted ? tokenizeLine(content, language) : null
  if (!tokens) return <span>{content}</span>
  return (
    <span>
      {tokens.map((token, i) => (
        <span key={i} style={token.color ? { color: token.color } : undefined}>
          {token.content}
        </span>
      ))}
    </span>
  )
}

const DiffLine: React.FC<{
  line: DiffLineType
  comments: ReviewCommentType[]
  language?: string
  highlighted: boolean
}> = React.memo(({ line, comments, language, highlighted }) => {
  const isHeader = line.type === 'header'

  return (
    <>
      <div className={`flex ${getDiffLineClass(line.type)}`}>
        <div className="w-16 flex-shrink-0 text-right pr-3 text-xs text-gray-500 select-none font-mono">
          {!isHeader && (
            <>
              <span className="inline-block w-7">{line.oldLineNumber}</span>
              <span className="mx-1">|</span>
              <span className="inline-block w-7">{line.newLineNumber}</span>
            </>
          )}
        </div>
        <div className="flex-1 px-4 py-1 font-mono text-sm overflow-x-auto">
          {!isHeader && (
            <span className="mr-2 text-gray-500 select-none">{getDiffLineSymbol(line.type)}</span>
          )}
          {isHeader ? (
            <span className="text-gray-600">{line.content}</span>
          ) : (
            <DiffLineContent content={line.content} language={language} highlighted={highlighted} />
          )}
          {comments.length > 0 && (
            <span className="ml-2 text-xs text-danger-600 font-semibold" aria-label="Has comment">
              💬
            </span>
          )}
        </div>
      </div>
      {comments.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="space-y-3">
            {comments.map(comment => (
              <ReviewComment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </>
  )
})

DiffLine.displayName = 'DiffLine'

const VirtualizedRows: React.FC<{
  rows: DiffRow[]
  commentsByLine: Map<number, ReviewCommentType[]>
  language?: string
  highlighted: boolean
}> = ({ rows, commentsByLine, language, highlighted }) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 20,
  })

  return (
    <div ref={parentRef} className="overflow-auto max-h-[70vh]" data-testid="virtual-diff">
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(item => {
          const { line, key } = rows[item.index]
          return (
            <div
              key={key}
              data-index={item.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${item.start}px)`,
              }}
            >
              <DiffLine
                line={line}
                comments={
                  line.newLineNumber
                    ? (commentsByLine.get(line.newLineNumber) ?? EMPTY_COMMENTS)
                    : EMPTY_COMMENTS
                }
                language={language}
                highlighted={highlighted}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ diff, comments, className = '' }) => {
  const highlighted = useHighlighter(diff.language)

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

  // Index comments by line once so each row does an O(1) lookup instead of filtering all comments.
  const commentsByLine = useMemo(() => {
    const map = new Map<number, ReviewCommentType[]>()
    for (const comment of comments) {
      const list = map.get(comment.lineNumber)
      if (list) list.push(comment)
      else map.set(comment.lineNumber, [comment])
    }
    return map
  }, [comments])

  const rows = useMemo<DiffRow[]>(
    () =>
      diff.hunks.flatMap((hunk, h) => hunk.lines.map((line, l) => ({ line, key: `${h}-${l}` }))),
    [diff.hunks]
  )

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

      {rows.length > VIRTUALIZE_THRESHOLD ? (
        <VirtualizedRows
          rows={rows}
          commentsByLine={commentsByLine}
          language={diff.language}
          highlighted={highlighted}
        />
      ) : (
        <div className="overflow-x-auto">
          {rows.map(({ line, key }) => (
            <DiffLine
              key={key}
              line={line}
              comments={
                line.newLineNumber
                  ? (commentsByLine.get(line.newLineNumber) ?? EMPTY_COMMENTS)
                  : EMPTY_COMMENTS
              }
              language={diff.language}
              highlighted={highlighted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
