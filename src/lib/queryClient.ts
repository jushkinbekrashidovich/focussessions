import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data in cache for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false, // Don't refetch when component remounts if data is fresh
      retry: 1, // Only retry failed requests once
    },
    mutations: {
      retry: 1, // Only retry failed mutations once
    },
  },
})
