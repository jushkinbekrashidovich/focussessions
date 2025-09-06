// lib/subscriptionUtils.ts
import { useUser } from '@/lib/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

// Use the same Supabase client instance to avoid multiple GoTrueClient instances

export function useSubscriptionStatus() {
  const { data: user, isLoading: userLoading } = useUser()
  
  console.log('🔍 Debug: useSubscriptionStatus called', {
    user: user?.id,
    userLoading,
    hasUser: !!user
  })
  
  // Query user subscription from database
  const { data: subscription, isLoading: subscriptionLoading, error: queryError } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🔍 Debug: No user ID, returning null')
        return null
      }
      
      console.log('🔍 Debug: Starting subscription query for user:', user.id)
      
      // Debug: Check all subscriptions first
      await debugUserSubscriptions(user.id)
      
      console.log('🔍 Debug: Using shared Supabase client')
      
      // First, let's test if we can query the table at all
      console.log('🔍 Debug: Testing basic table access...')
      const { data: testData, error: testError } = await supabase
        .from('user_subscriptions')
        .select('count')
        .limit(1)
      
      console.log('🔍 Debug: Basic table test:', { testData, testError })
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      console.log('🔍 Debug: Query executed', {
        data,
        error,
        errorCode: error?.code,
        errorMessage: error?.message
      })
      console.log('🔍 Debug: Query executed DATA:', JSON.stringify(data, null, 2))
      console.log('🔍 Debug: Query executed ERROR:', JSON.stringify(error, null, 2))
      
      if (error) {
        console.error('❌ Error fetching subscription:', error)
        return null
      }
      
      console.log('🔍 Debug: Query successful, data:', data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Check if subscription is active and not expired
  const isPro = subscription && isSubscriptionActive(subscription)
  const isLoading = userLoading || subscriptionLoading
  
  console.log('🔍 Debug: Final subscription status check:', {
    user: user?.id,
    subscription,
    isPro,
    isLoading,
    userLoading,
    subscriptionLoading,
    queryError
  })
  
  // If user is still loading, return loading state
  if (userLoading) {
    console.log('🔍 Debug: User still loading, returning loading state')
    return {
      isPro: false,
      isLoading: true,
      user,
      subscription
    }
  }
  
  // If no user after loading, return free state
  if (!user) {
    console.log('🔍 Debug: No user after loading, returning free state')
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
  console.log('🔍 Debug: isSubscriptionActive called with:', subscription)
  
  if (!subscription || subscription.status !== 'active') {
    console.log('🔍 Debug: Subscription not active or null:', { subscription, status: subscription?.status })
    return false
  }
  
  // For lifetime plans, always active
  if (subscription.plan_type === 'lifetime') {
    console.log('🔍 Debug: Lifetime plan - always active')
    return true
  }
  
  // For recurring plans, check if not expired
  if (subscription.current_period_end) {
    const now = new Date()
    const endDate = new Date(subscription.current_period_end)
    const isActive = endDate > now
    
    console.log('🔍 Debug: Checking expiration:', {
      now: now.toISOString(),
      endDate: endDate.toISOString(),
      isActive,
      planType: subscription.plan_type
    })
    
    return isActive
  }
  
  console.log('🔍 Debug: No end date - assuming active')
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
  console.log('🔍 Debug: Checking all subscriptions for user:', userId)
  
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  console.log('🔍 Debug: All user subscriptions:', { data, error })
  console.log('🔍 Debug: All user subscriptions DATA:', JSON.stringify(data, null, 2))
  console.log('🔍 Debug: All user subscriptions ERROR:', JSON.stringify(error, null, 2))
  return { data, error }
}
