import React, { useMemo, useState } from 'react'
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
import { FileUpload, UploadedFileData } from '../components/FileUpload/FileUpload'
import { Button } from '../components/UI'
import { Skeleton, SkeletonCard } from '../components/Skeleton/Skeleton'
import { SeverityLevel, FileNode } from '../types'
import { generateDiff } from '../utils/diffGenerator'

export const DashboardEnhanced: React.FC = () => {
  const {
    selectedRepoId,
    selectedFileId,
    filters,
    setSelectedFile,
    setFilters,
    resetFilters,
    uploadedFiles,
    uploadedDiffs,
    addUploadedFile,
    addUploadedDiff,
    clearUploadedFiles,
  } = useReviewStore()

  const [uploadMode, setUploadMode] = useState(false)
  const [originalContent, setOriginalContent] = useState<Record<string, string>>({})

  const { data: repos, isLoading: reposLoading } = useRepos()
  const { data: mockFiles, isLoading: filesLoading } = useFiles(selectedRepoId)
  const { data: mockDiff, isLoading: diffLoading } = useDiff(selectedFileId)
  const { data: allReviews } = useReviews()

  // Combine mock files with uploaded files
  const files = useMemo(() => {
    if (uploadMode && uploadedFiles.length > 0) {
      // Create file nodes from uploaded files
      const uploadedFileNodes: FileNode[] = uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        path: file.name,
        type: 'file' as const,
        commentCount: 0,
      }))

return [
        {
          id: 'uploaded-root',
          name: 'Uploaded Files',
          path: 'uploads',
          type: 'directory' as const,
          children: uploadedFileNodes,
        },
      ]
    }
    return mockFiles || []
  }, [uploadMode, uploadedFiles, mockFiles])

  // Get the appropriate diff
  const currentDiff = useMemo(() => {
    if (uploadMode && selectedFileId && uploadedDiffs[selectedFileId]) {
      return uploadedDiffs[selectedFileId]
    }
    return mockDiff
  }, [uploadMode, selectedFileId, uploadedDiffs, mockDiff])

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

  const handleFilesUploaded = (uploadedFilesData: UploadedFileData[]) => {
    uploadedFilesData.forEach(file => {
      addUploadedFile(file)
      
      // Store original content for future diff comparison
      setOriginalContent(prev => ({
        ...prev,
        [file.id]: file.content,
      }))

      // Generate a diff comparing empty content vs uploaded content (shows all as additions)
      const diff = generateDiff('', file.content, file.name)
      addUploadedDiff(file.id, diff)
    })

    if (!uploadMode) {
      setUploadMode(true)
    }
  }

  const handleUpdateFile = (fileId: string, newContent: string) => {
    const original = originalContent[fileId] || ''
    const file = uploadedFiles.find(f => f.id === fileId)
    
    if (file) {
      const diff = generateDiff(original, newContent, file.name)
      addUploadedDiff(fileId, diff)
    }
  }

  const handleToggleMode = () => {
    setUploadMode(!uploadMode)
    setSelectedFile(null)
  }

  const handleClearUploads = () => {
    clearUploadedFiles()
    setOriginalContent({})
    setUploadMode(false)
  }

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
                {uploadMode
                  ? 'Reviewing your uploaded files'
                  : 'Intelligent code analysis powered by machine learning'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {uploadMode && (
                <Button variant="ghost" size="sm" onClick={handleClearUploads}>
                  Clear Uploads
                </Button>
              )}
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
        <div className="mb-6 flex items-center gap-4">
          {!uploadMode && <RepoSelector repositories={repos || []} isLoading={reposLoading} />}
          
          <Button
            variant={uploadMode ? 'primary' : 'secondary'}
            onClick={handleToggleMode}
            className="ml-auto"
          >
            {uploadMode ? '← Back to Demo' : '📤 Upload Your Files'}
          </Button>
        </div>

        {uploadMode && uploadedFiles.length === 0 && (
          <FileUpload onFilesUploaded={handleFilesUploaded} className="mb-6" />
        )}

        {uploadMode && uploadedFiles.length > 0 && (
          <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-900 mb-1">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                </h3>
                <p className="text-sm text-primary-800">
                  Select a file from the tree to view its content. To add more files, click below:
                </p>
                <div className="mt-3">
                  <FileUpload onFilesUploaded={handleFilesUploaded} />
                </div>
              </div>
            </div>
          </div>
        )}

        {(selectedRepoId || uploadMode) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3">
              {filesLoading && !uploadMode ? (
                <SkeletonCard />
              ) : files.length > 0 ? (
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
                  {diffLoading && !uploadMode ? (
                    <SkeletonCard />
                  ) : currentDiff ? (
                    <>
                      <DiffViewer diff={currentDiff} comments={filteredReviews} />
                      {uploadMode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            💡 <strong>Note:</strong> This is a frontend-only demo. To get AI-powered
                            code reviews, integrate with an AI API or backend service.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                      <p className="text-gray-500">Unable to load diff</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">{uploadMode ? '📁' : '📋'}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {uploadMode ? 'Upload files to review' : 'Select a file to review'}
                    </h3>
                    <p className="text-gray-600">
                      {uploadMode
                        ? 'Upload your code files above to see them analyzed and diffed.'
                        : 'Choose a file from the tree on the left to view its diff and AI-generated review comments.'}
                    </p>
                    {!uploadMode && (
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
                    )}
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

        {!selectedRepoId && !uploadMode && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to AI Code Review
              </h3>
              <p className="text-gray-600 mb-6">
                Select a repository from the dropdown above to start reviewing code changes and AI
                feedback, or upload your own files to analyze.
              </p>
              <Button onClick={() => setUploadMode(true)} size="lg">
                📤 Upload Your Code Files
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
export default DashboardEnhanced
