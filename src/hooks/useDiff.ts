import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export const useDiff = (fileId: string | null) => {
  return useQuery({
    queryKey: ['diff', fileId],
    queryFn: () => api.fetchDiff(fileId!),
    enabled: !!fileId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useReviews = (fileId?: string) => {
  return useQuery({
    queryKey: ['reviews', fileId],
    queryFn: () => api.fetchReviews(fileId),
    staleTime: 5 * 60 * 1000,
  })
}
