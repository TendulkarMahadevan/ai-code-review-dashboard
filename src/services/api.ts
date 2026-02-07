import { Repository, FileNode, FileDiff, ReviewComment } from '../types'
import reposData from '../mocks/repos.json'
import filesData from '../mocks/files.json'
import diffsData from '../mocks/diffs.json'
import reviewsData from '../mocks/reviews.json'

const MOCK_DELAY = 300

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  async fetchRepositories(): Promise<Repository[]> {
    await delay(MOCK_DELAY)
    return reposData as Repository[]
  },

  async fetchFiles(repoId: string): Promise<FileNode[]> {
    await delay(MOCK_DELAY)
    const files = (filesData as Record<string, FileNode[]>)[repoId]
    if (!files) {
      throw new Error(`No files found for repository: ${repoId}`)
    }
    return files
  },

  async fetchDiff(fileId: string): Promise<FileDiff> {
    await delay(MOCK_DELAY)
    const diff = (diffsData as Record<string, FileDiff>)[fileId]
    if (!diff) {
      throw new Error(`No diff found for file: ${fileId}`)
    }
    return diff
  },

  async fetchReviews(fileId?: string): Promise<ReviewComment[]> {
    await delay(MOCK_DELAY)
    const allReviews = reviewsData as ReviewComment[]
    if (fileId) {
      return allReviews.filter(review => review.fileId === fileId)
    }
    return allReviews
  },
}
