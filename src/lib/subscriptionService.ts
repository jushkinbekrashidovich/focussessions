// lib/subscriptionService.ts
import { createClient } from '@supabase/supabase-js'

// Create Supabase client for server-side operations
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

// Check and update expired subscriptions
export async function checkExpiredSubscriptions() {
  const supabase = getSupabaseClient()
  
  try {
    // Find subscriptions that should be expired
    const now = new Date().toISOString()
    
    const { data: expiredSubscriptions, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('status', 'active')
      .neq('plan_type', 'lifetime') // Don't expire lifetime plans
      .lt('current_period_end', now)
    
    if (error) {
      console.error('Error fetching expired subscriptions:', error)
      return
    }
    
    if (expiredSubscriptions && expiredSubscriptions.length > 0) {
      // Update expired subscriptions
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'expired',
          updated_at: new Date().toISOString()
        })
        .in('id', expiredSubscriptions.map(sub => sub.id))
      
      if (updateError) {
        console.error('Error updating expired subscriptions:', updateError)
      } else {
        console.log(`Updated ${expiredSubscriptions.length} expired subscriptions`)
      }
    }
  } catch (error) {
    console.error('Error in checkExpiredSubscriptions:', error)
  }
}

// Get user subscription status
export async function getUserSubscriptionStatus(userId: string) {
  const supabase = getSupabaseClient()
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user subscription:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getUserSubscriptionStatus:', error)
    return null
  }
}

// Update subscription status (for webhooks)
export async function updateSubscriptionStatus(
  userId: string, 
  status: 'active' | 'canceled' | 'expired' | 'paused',
  planType?: string
) {
  const supabase = getSupabaseClient()
  
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status,
        plan_type: planType,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error updating subscription status:', error)
      throw error
    }
    
    console.log(`Updated subscription status for user ${userId}: ${status}`)
  } catch (error) {
    console.error('Error in updateSubscriptionStatus:', error)
    throw error
  }
}
