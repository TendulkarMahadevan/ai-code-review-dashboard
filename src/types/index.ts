export interface Repository {
  id: string
  name: string
  owner: string
  description: string
  branch: string
}

export interface FileNode {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  commentCount?: number
}

export interface DiffLine {
  lineNumber: number
  oldLineNumber?: number
  newLineNumber?: number
  type: 'add' | 'remove' | 'context' | 'header'
  content: string
  hasComment?: boolean
}

export interface DiffHunk {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: DiffLine[]
}

export interface FileDiff {
  id: string
  fileName: string
  oldFileName?: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  additions: number
  deletions: number
  hunks: DiffHunk[]
  language?: string
}

export type SeverityLevel = 'info' | 'warning' | 'critical'

export interface ReviewComment {
  id: string
  fileId: string
  fileName: string
  lineNumber: number
  severity: SeverityLevel
  category: string
  message: string
  suggestion?: string
  aiConfidence: number
  timestamp: string
}

export interface FilterState {
  severity: SeverityLevel[]
  searchQuery: string
  showOnlyFilesWithIssues: boolean
}

export interface ReviewState {
  selectedRepoId: string | null
  selectedFileId: string | null
  filters: FilterState
  setSelectedRepo: (repoId: string) => void
  setSelectedFile: (fileId: string | null) => void
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}
