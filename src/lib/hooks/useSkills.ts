import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillsService } from '@/lib/skillsService'

// Query keys for consistent caching
export const skillKeys = {
  all: ['skills'] as const,
  user: () => [...skillKeys.all, 'user'] as const,
  progress: (skillId: string) => [...skillKeys.all, 'progress', skillId] as const,
}

// Hook to get user skills
export function useSkills() {
  return useQuery({
    queryKey: skillKeys.user(),
    queryFn: skillsService.getUserSkills,
    staleTime: 2 * 60 * 1000, // 2 minutes for skills data
  })
}

// Hook to get skill progress
export function useSkillProgress(skillId: string) {
  return useQuery({
    queryKey: skillKeys.progress(skillId),
    queryFn: () => skillsService.getSkillProgress(skillId),
    staleTime: 5 * 60 * 1000, // 5 minutes for progress data
    enabled: !!skillId, // Only run query if skillId exists
  })
}

// Hook to create a skill
export function useCreateSkill() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name, targetHours, description }: { name: string; targetHours: number; description: string }) =>
      skillsService.createSkill(name, targetHours, description),
    onSuccess: () => {
      // Invalidate and refetch skills list
      queryClient.invalidateQueries({ queryKey: skillKeys.user() })
    },
  })
}

// Hook to update a skill
export function useUpdateSkill() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ skillId, name, targetHours, description }: { skillId: string; name: string; targetHours: number; description: string }) =>
      skillsService.updateSkill(skillId, { name, target_hours: targetHours, description }),
    onSuccess: (_, { skillId }) => {
      // Invalidate skills list and specific skill progress
      queryClient.invalidateQueries({ queryKey: skillKeys.user() })
      queryClient.invalidateQueries({ queryKey: skillKeys.progress(skillId) })
    },
  })
}

// Hook to delete a skill
export function useDeleteSkill() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: skillsService.deleteSkill,
    onSuccess: () => {
      // Invalidate skills list
      queryClient.invalidateQueries({ queryKey: skillKeys.user() })
    },
  })
}
