import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userPreferencesService, UserPreferences } from '../userPreferencesService'
import { getUserCurrentTimezone } from '../timezoneUtils'

export function useUserPreferences() {
  const queryClient = useQueryClient()

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: userPreferencesService.getUserPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const updateTimezoneMutation = useMutation({
    mutationFn: userPreferencesService.updateTimezone,
    onSuccess: () => {
      // Invalidate and refetch user preferences
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] })
      // Also invalidate sessions to refresh heatmap
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const getCurrentTimezone = (): string => {
    // Return user's selected timezone if available, otherwise fall back to detected timezone
    return preferences?.timezone || getUserCurrentTimezone()
  }

  return {
    preferences,
    isLoading,
    error,
    currentTimezone: getCurrentTimezone(),
    updateTimezone: updateTimezoneMutation.mutate,
    isUpdatingTimezone: updateTimezoneMutation.isPending,
  }
}
