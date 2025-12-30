// lib/hooks/useHabits.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserHabits,
  getHabitCompletionsForMonth,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  type Habit,
  type HabitCompletion,
} from '@/lib/habitsService'

// Query keys for consistent caching
export const habitKeys = {
  all: ['habits'] as const,
  user: () => [...habitKeys.all, 'user'] as const,
  completions: (year: number, month: number) => [...habitKeys.all, 'completions', year, month] as const,
}

// Hook to get user habits
export function useHabits() {
  return useQuery({
    queryKey: habitKeys.user(),
    queryFn: getUserHabits,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to get habit completions for a month
export function useHabitCompletions(year: number, month: number) {
  return useQuery({
    queryKey: habitKeys.completions(year, month),
    queryFn: () => getHabitCompletionsForMonth(year, month),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for real-time feel)
  })
}

// Hook to create a habit
export function useCreateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createHabit(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.user() })
      // Invalidate all completion queries to refresh stats
      queryClient.invalidateQueries({ queryKey: habitKeys.all })
    },
  })
}

// Hook to update a habit
export function useUpdateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, updates }: { habitId: string; updates: { name?: string; is_active?: boolean } }) =>
      updateHabit(habitId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.user() })
      queryClient.invalidateQueries({ queryKey: habitKeys.all })
    },
  })
}

// Hook to delete a habit
export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.user() })
      queryClient.invalidateQueries({ queryKey: habitKeys.all })
    },
  })
}

// Hook to toggle habit completion
export function useToggleHabitCompletion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      toggleHabitCompletion(habitId, date),
    onSuccess: (_, { date }) => {
      // Extract year and month from date (YYYY-MM-DD)
      const [year, month] = date.split('-').map(Number)
      // Invalidate the specific month's completions
      queryClient.invalidateQueries({ queryKey: habitKeys.completions(year, month) })
      // Also invalidate user habits to refresh active count
      queryClient.invalidateQueries({ queryKey: habitKeys.user() })
    },
  })
}

