import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

// Query keys for subscription caching
export const subscriptionKeys = {
  all: ['subscription'] as const,
  user: (userId: string) => [...subscriptionKeys.all, 'user', userId] as const,
}

// Hook to get user subscription
export function useSubscription(userId?: string) {
  return useQuery({
    queryKey: subscriptionKeys.user(userId || ''),
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .rpc('get_user_subscription', { user_uuid: userId })
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        return null
      }

      return data
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Helper function to check if user has active subscription
export function isSubscriptionActive(subscription: Record<string, unknown> | null): boolean {
  if (!subscription) return false
  
  // For lifetime plans, check if status is active
  if (subscription.plan_type === 'lifetime') {
    return subscription.status === 'active'
  }
  
  // For recurring plans, check if status is active and not expired
  if (subscription.status !== 'active') return false
  
  if (subscription.current_period_end && typeof subscription.current_period_end === 'string') {
    const now = new Date()
    const endDate = new Date(subscription.current_period_end)
    return now < endDate
  }
  
  return true
}

// Helper function to get plan features
export function getPlanFeatures(planType: string) {
  switch (planType) {
    case 'pro_monthly':
    case 'pro_yearly':
    case 'lifetime':
      return {
        maxCategories: Infinity,
        hasAnalytics: true,
        hasCustomGoals: true,
        hasPrioritySupport: true,
        hasExport: planType === 'lifetime',
      }
    default:
      return {
        maxCategories: 3,
        hasAnalytics: false,
        hasCustomGoals: false,
        hasPrioritySupport: false,
        hasExport: false,
      }
  }
}
