import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionsService } from '@/lib/skillsService'

// Query keys for consistent caching
export const sessionKeys = {
  all: ['sessions'] as const,
  user: () => [...sessionKeys.all, 'user'] as const,
  recent: (limit: number) => [...sessionKeys.all, 'recent', limit] as const,
}

// Hook to get user sessions
export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.user(),
    queryFn: sessionsService.getUserSessions,
    staleTime: 1 * 60 * 1000, // 1 minute for sessions data
  })
}

// Hook to get recent sessions
export function useRecentSessions(limit: number = 10) {
  return useQuery({
    queryKey: sessionKeys.recent(limit),
    queryFn: async () => {
      const sessions = await sessionsService.getUserSessions()
      return sessions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
    },
    staleTime: 1 * 60 * 1000, // 1 minute for recent sessions
  })
}

// Hook to create a session
export function useCreateSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ skillId, duration, note }: { skillId: string; duration: number; note?: string }) => {
      const endTime = new Date().toISOString()
      const startTime = new Date(Date.now() - duration * 60 * 1000).toISOString()
      return sessionsService.createSession(skillId, startTime, endTime, note)
    },
    onSuccess: () => {
      // Invalidate all session-related queries
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}
