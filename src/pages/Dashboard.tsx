import React, { useMemo } from 'react'
import { useRepos } from '../hooks/useRepos'
import { useFiles } from '../hooks/useFiles'
import { useDiff, useReviews } from '../hooks/useDiff'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useReviewStore } from '../store/reviewStore'
import { RepoSelector } from '../components/RepoSelector/RepoSelector'
import { FileTree } from '../components/FileTree/FileTree'
import { DiffViewer } from '../components/DiffViewer/DiffViewer'
import { ReviewComment } from '../components/ReviewComment/ReviewComment'
import { SearchInput } from '../components/SearchInput/SearchInput'
import { SeverityBadge } from '../components/SeverityBadge/SeverityBadge'
import { Button } from '../components/UI'
import { Skeleton, SkeletonCard } from '../components/Skeleton/Skeleton'
import { SeverityLevel } from '../types'

export const Dashboard: React.FC = () => {
  const { selectedRepoId, selectedFileId, filters, setSelectedFile, setFilters, resetFilters } =
    useReviewStore()

  const { data: repos, isLoading: reposLoading } = useRepos()
  const { data: files, isLoading: filesLoading } = useFiles(selectedRepoId)
  const { data: diff, isLoading: diffLoading } = useDiff(selectedFileId)
  const { data: allReviews } = useReviews()

  useKeyboardNavigation({
    files: files || [],
    selectedFileId,
    onSelectFile: setSelectedFile,
    enabled: !!files && files.length > 0,
  })

  const filteredReviews = useMemo(() => {
    if (!allReviews) return []

    let filtered = allReviews

    if (selectedFileId) {
      filtered = filtered.filter(r => r.fileId === selectedFileId)
    }

    if (filters.severity.length > 0) {
      filtered = filtered.filter(r => filters.severity.includes(r.severity))
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.message.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.fileName.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [allReviews, selectedFileId, filters])

  const handleSeverityToggle = (severity: SeverityLevel) => {
    const newSeverities = filters.severity.includes(severity)
      ? filters.severity.filter(s => s !== severity)
      : [...filters.severity, severity]

    setFilters({ severity: newSeverities })
  }

  const severityCounts = useMemo(() => {
    if (!allReviews) return { info: 0, warning: 0, critical: 0 }

    return allReviews.reduce(
      (acc, review) => {
        acc[review.severity]++
        return acc
      },
      { info: 0, warning: 0, critical: 0 } as Record<SeverityLevel, number>
    )
  }, [allReviews])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 tracking-tight">
                AI Code Review
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Intelligent code analysis powered by machine learning
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SeverityBadge severity="critical" showLabel={false} />
                <span className="text-sm font-semibold text-gray-700">
                  {severityCounts.critical}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity="warning" showLabel={false} />
                <span className="text-sm font-semibold text-gray-700">
                  {severityCounts.warning}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity="info" showLabel={false} />
                <span className="text-sm font-semibold text-gray-700">{severityCounts.info}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="mb-6">
          <RepoSelector repositories={repos || []} isLoading={reposLoading} />
        </div>

        {selectedRepoId && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3">
              {filesLoading ? (
                <SkeletonCard />
              ) : files ? (
                <FileTree files={files} />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">No files available</p>
                </div>
              )}
            </aside>

            <section className="lg:col-span-9 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <SearchInput
                    placeholder="Search comments by keyword..."
                    onSearch={query => setFilters({ searchQuery: query })}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="sm:w-auto w-full"
                  >
                    Reset Filters
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 py-2">Filter by severity:</span>
                  {(['info', 'warning', 'critical'] as SeverityLevel[]).map(severity => (
                    <button
                      key={severity}
                      onClick={() => handleSeverityToggle(severity)}
                      className={`transition-all ${
                        filters.severity.includes(severity)
                          ? 'ring-2 ring-primary-500 ring-offset-2'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      aria-pressed={filters.severity.includes(severity)}
                    >
                      <SeverityBadge severity={severity} />
                    </button>
                  ))}
                </div>
              </div>

              {selectedFileId ? (
                <>
                  {diffLoading ? (
                    <SkeletonCard />
                  ) : diff ? (
                    <DiffViewer diff={diff} comments={filteredReviews} />
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                      <p className="text-gray-500">Unable to load diff</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a file to review
                    </h3>
                    <p className="text-gray-600">
                      Choose a file from the tree on the left to view its diff and AI-generated
                      review comments.
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                      <p className="text-sm text-gray-700 font-medium mb-2">
                        💡 Keyboard shortcuts:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            ↑
                          </kbd>{' '}
                          or{' '}
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            k
                          </kbd>{' '}
                          - Previous file
                        </li>
                        <li>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            ↓
                          </kbd>{' '}
                          or{' '}
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            j
                          </kbd>{' '}
                          - Next file
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {!selectedFileId && filteredReviews.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    All Comments ({filteredReviews.length})
                  </h3>
                  <div className="space-y-3">
                    {filteredReviews.map(comment => (
                      <ReviewComment key={comment.id} comment={comment} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {!selectedRepoId && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to AI Code Review
              </h3>
              <p className="text-gray-600">
                Select a repository from the dropdown above to start reviewing code changes and AI
                feedback.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
