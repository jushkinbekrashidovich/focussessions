// lib/subscriptionUtils.ts
import { useUser } from '@/lib/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

// Use the same Supabase client instance to avoid multiple GoTrueClient instances

export function useSubscriptionStatus() {
  const { data: user, isLoading: userLoading } = useUser()
  
  // Query user subscription from database
  const { data: subscription, isLoading: subscriptionLoading, error: queryError } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return null
      }
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) {
        console.error('Error fetching subscription:', error)
        return null
      }
      
      return data
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Check if subscription is active and not expired
  const isPro = subscription && isSubscriptionActive(subscription)
  const isLoading = userLoading || subscriptionLoading
  
  // If user is still loading, return loading state
  if (userLoading) {
    return {
      isPro: false,
      isLoading: true,
      user,
      subscription
    }
  }
  
  // If no user after loading, return free state
  if (!user) {
    return {
      isPro: false,
      isLoading: false,
      user,
      subscription
    }
  }
  
  return {
    isPro,
    isSubscriptionLoading: isLoading,
    user,
    subscription
  }
}

// Subscription interface
interface Subscription {
  id: string
  user_id: string
  paddle_subscription_id: string
  status: 'active' | 'canceled' | 'expired' | 'paused'
  plan_type: 'free' | 'pro_monthly' | 'pro_yearly' | 'lifetime'
  current_period_start?: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

// Check if subscription is currently active
function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription || subscription.status !== 'active') {
    return false
  }
  
  // For lifetime plans, always active
  if (subscription.plan_type === 'lifetime') {
    return true
  }
  
  // For recurring plans, check if not expired
  if (subscription.current_period_end) {
    const now = new Date()
    const endDate = new Date(subscription.current_period_end)
    const isActive = endDate > now
    
    return isActive
  }
  
  return true
}

interface User {
  id?: string
  subscription_status?: string
  plan_type?: string
}

export function getSubscriptionStatus(user: User | null | undefined) {
  if (!user) return 'free'
  
  // Check if user has active subscription
  if (user.subscription_status === 'active') {
    return user.plan_type || 'pro'
  }
  
  return 'free'
}

// Debug function to check all subscriptions for a user
export async function debugUserSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}
