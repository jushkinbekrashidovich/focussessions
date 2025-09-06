// lib/subscriptionUtils.ts
import { useUser } from '@/lib/hooks/useAuth'

export function useSubscriptionStatus() {
  const { data: user, isLoading } = useUser()
  
  // For now, we'll assume free users don't have a subscription record
  // In the future, you can check the user_subscriptions table
  // Since Supabase User doesn't have subscription fields, we'll default to free
  const isPro = false // TODO: Implement actual subscription checking
  
  return {
    isPro,
    isLoading,
    user
  }
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
