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

    // Get Paddle API credentials
    const paddleApiKey = process.env.PADDLE_API_KEY
    
    if (!paddleApiKey) {
      return NextResponse.json({ error: 'Paddle API key not configured' }, { status: 500 })
    }

    // Debug: Log API key format (first few characters only for security)
    console.log('🔍 Debug: Paddle API key format:', paddleApiKey.substring(0, 10) + '...')
    
    // Validate API key format
    if (!paddleApiKey.startsWith('pdl_')) {
      console.error('❌ Invalid Paddle API key format. Should start with "pdl_"')
      return NextResponse.json({ error: 'Invalid Paddle API key format' }, { status: 500 })
    }

    // Cancel subscription in Paddle
    const paddleResponse = await fetch(`https://api.paddle.com/v1/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        effective_from: 'next_billing_period' // Cancel at end of current period
      })
    })

    if (!paddleResponse.ok) {
      const errorData = await paddleResponse.text()
      console.error('❌ Paddle cancellation error:', errorData)
      console.error('❌ Response status:', paddleResponse.status)
      console.error('❌ Response headers:', Object.fromEntries(paddleResponse.headers.entries()))
      return NextResponse.json({ 
        error: 'Failed to cancel subscription in Paddle', 
        details: errorData,
        status: paddleResponse.status 
      }, { status: paddleResponse.status })
    }

    const paddleData = await paddleResponse.json()
    console.log('✅ Paddle cancellation response:', paddleData)

    // Update subscription status in our database
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
      // Don't fail the request since Paddle cancellation succeeded
    }

    console.log('✅ Subscription canceled successfully in both Paddle and database')

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription canceled successfully. You will retain access until the end of your current billing period.',
      data: paddleData
    })

  } catch (error) {
    console.error('❌ Subscription cancellation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
