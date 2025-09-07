import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for server-side operations
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    console.log('🔍 Debug: Canceling subscription:', subscriptionId)

    // Update subscription status in database
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('paddle_subscription_id', subscriptionId)
      .select()

    if (error) {
      console.error('❌ Error updating subscription status:', error)
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
    }

    console.log('✅ Subscription canceled successfully:', data)

    // TODO: In a production environment, you would also want to:
    // 1. Call Paddle's API to cancel the subscription on their end
    // 2. Send confirmation email to the user
    // 3. Log the cancellation event for analytics

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription canceled successfully',
      data 
    })

  } catch (error) {
    console.error('❌ Subscription cancellation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
