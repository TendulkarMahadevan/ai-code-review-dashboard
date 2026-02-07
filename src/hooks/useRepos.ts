import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export const useRepos = () => {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: api.fetchRepositories,
    staleTime: 5 * 60 * 1000,
  })
}
