import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/lib/statsService'

// Query keys for consistent caching
export const statsKeys = {
  all: ['stats'] as const,
  deepWork: () => [...statsKeys.all, 'deepWork'] as const,
}

// Hook to get deep work stats
export function useDeepWorkStats() {
  return useQuery({
    queryKey: statsKeys.deepWork(),
    queryFn: statsService.getDeepWorkStats,
    staleTime: 5 * 60 * 1000, // 5 minutes for stats data
  })
}
