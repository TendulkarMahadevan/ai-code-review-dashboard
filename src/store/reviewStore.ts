import { create } from 'zustand'
import { ReviewState, FilterState } from '../types'

const initialFilters: FilterState = {
  severity: [],
  searchQuery: '',
  showOnlyFilesWithIssues: false,
}

export const useReviewStore = create<ReviewState>(set => ({
  selectedRepoId: null,
  selectedFileId: null,
  filters: initialFilters,

  setSelectedRepo: (repoId: string) =>
    set({ selectedRepoId: repoId, selectedFileId: null }),

  setSelectedFile: (fileId: string | null) => set({ selectedFileId: fileId }),

  setFilters: (filters: Partial<FilterState>) =>
    set(state => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}))
