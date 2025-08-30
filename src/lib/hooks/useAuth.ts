import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

// Query keys for consistent caching
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// Hook to get current user
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for user data
    retry: false, // Don't retry auth failures
  })
}
