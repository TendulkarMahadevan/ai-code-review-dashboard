import React from 'react'
import { Repository } from '../../types'
import { useReviewStore } from '../../store/reviewStore'

interface RepoSelectorProps {
  repositories: Repository[]
  isLoading?: boolean
}

export const RepoSelector: React.FC<RepoSelectorProps> = ({ repositories, isLoading }) => {
  const { selectedRepoId, setSelectedRepo } = useReviewStore()

  const selectedRepo = repositories.find(r => r.id === selectedRepoId)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRepo(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label htmlFor="repo-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Select Repository
      </label>
      <div className="relative">
        <select
          id="repo-select"
          value={selectedRepoId || ''}
          onChange={handleChange}
          className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-lg bg-white transition-all cursor-pointer hover:border-gray-400"
          aria-label="Select repository"
        >
          <option value="">Choose a repository...</option>
          {repositories.map(repo => (
            <option key={repo.id} value={repo.id}>
              {repo.owner}/{repo.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {selectedRepo && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Branch:</span> {selectedRepo.branch} •{' '}
          <span className="font-medium">Description:</span> {selectedRepo.description}
        </p>
      )}
    </div>
  )
}
