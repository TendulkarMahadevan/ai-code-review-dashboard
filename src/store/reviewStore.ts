import { create } from 'zustand'
import { ReviewState, FilterState, FileDiff } from '../types'

const initialFilters: FilterState = {
  severity: [],
  searchQuery: '',
  showOnlyFilesWithIssues: false,
}

interface UploadedFile {
  id: string
  name: string
  content: string
  language: string
}

interface ExtendedReviewState extends ReviewState {
  uploadedFiles: UploadedFile[]
  uploadedDiffs: Record<string, FileDiff>
  addUploadedFile: (file: UploadedFile) => void
  addUploadedDiff: (fileId: string, diff: FileDiff) => void
  clearUploadedFiles: () => void
}

export const useReviewStore = create<ExtendedReviewState>(set => ({
  selectedRepoId: null,
  selectedFileId: null,
  filters: initialFilters,
  uploadedFiles: [],
  uploadedDiffs: {},

  setSelectedRepo: (repoId: string) =>
    set({ selectedRepoId: repoId, selectedFileId: null }),

  setSelectedFile: (fileId: string | null) => set({ selectedFileId: fileId }),

  setFilters: (filters: Partial<FilterState>) =>
    set(state => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  addUploadedFile: (file: UploadedFile) =>
    set(state => ({
      uploadedFiles: [...state.uploadedFiles, file],
    })),

  addUploadedDiff: (fileId: string, diff: FileDiff) =>
    set(state => ({
      uploadedDiffs: { ...state.uploadedDiffs, [fileId]: diff },
    })),

  clearUploadedFiles: () =>
    set({ uploadedFiles: [], uploadedDiffs: {}, selectedFileId: null }),
}))
