import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export const useFiles = (repoId: string | null) => {
  return useQuery({
    queryKey: ['files', repoId],
    queryFn: () => api.fetchFiles(repoId!),
    enabled: !!repoId,
    staleTime: 5 * 60 * 1000,
  })
}
