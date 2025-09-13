import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Initialize Supabase client for server-side operations
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

// Verify Paddle webhook signature
function verifyPaddleSignature(payload: string, signature: string, secret: string): boolean {
  try {
    // Paddle signature format: "ts=timestamp;h1=hash"
    const signatureParts = signature.split(';')
    const timestamp = signatureParts.find(part => part.startsWith('ts='))?.split('=')[1]
    const hash = signatureParts.find(part => part.startsWith('h1='))?.split('=')[1]
    
    if (!timestamp || !hash) {
      console.log('❌ Invalid signature format:', signature)
      return false
    }
    
    // Create expected signature using Paddle's format: timestamp:payload
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(timestamp + ':' + payload)
      .digest('hex')
    
    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.log('❌ Signature verification error:', error)
    return false
  }
}

// Update user subscription in Supabase
async function updateUserSubscription(userId: string, subscriptionData: Record<string, unknown>) {
  console.log('🔍 Debug: updateUserSubscription called', {
    userId,
    subscriptionData: JSON.stringify(subscriptionData, null, 2)
  })
  
  const items = subscriptionData.items as Array<{ price: { id: string } }> | undefined
  const billingPeriod = subscriptionData.current_billing_period as { starts_at: string; ends_at: string } | undefined
  
  console.log('🔍 Debug: Parsed data', {
    items,
    billingPeriod,
    priceId: items?.[0]?.price?.id
  })
  
  // Determine plan type based on price ID
  let planType = 'free'
  const priceId = items?.[0]?.price?.id
  if (priceId === 'pri_01k50r1ab8xr3vzbh8q4rgt06s') planType = 'pro_monthly'
  else if (priceId === 'pri_01k50r48tjn4ppyxmq6tkmrxaa') planType = 'pro_yearly'
  else if (priceId === 'pri_01k4expr4yywz3g9sste7t34px') planType = 'lifetime'
  
  console.log('🔍 Debug: Determined plan type', { planType, priceId })
  
  const supabase = getSupabaseClient()
  const upsertData = {
    user_id: userId,
    paddle_subscription_id: subscriptionData.id as string,
    status: subscriptionData.status as string,
    plan_type: planType,
    current_period_start: billingPeriod?.starts_at,
    current_period_end: billingPeriod?.ends_at,
    created_at: subscriptionData.created_at as string,
    updated_at: new Date().toISOString(),
  }
  
  console.log('🔍 Debug: Upsert data', upsertData)
  
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(upsertData, {
      onConflict: 'user_id'  // Specify which column to use for conflict resolution
    })
    .select()

  console.log('🔍 Debug: Upsert result', { data, error })

  if (error) {
    console.error('❌ Error updating user subscription:', error)
    throw error
  }

  console.log(`✅ Updated subscription for user ${userId}: ${planType}`)
  return data
}

// Handle successful payment
async function handleSuccessfulPayment(eventData: Record<string, unknown>) {
  const customData = eventData.custom_data as { user_id: string } | undefined
  const items = eventData.items as Array<{ price: { id: string } }> | undefined
  
  if (!customData?.user_id) {
    console.error('No user_id in custom_data:', customData)
    return
  }

  const userId = customData.user_id
  const priceId = items?.[0]?.price?.id

  // Determine plan type based on price ID (Sandbox)
  let planType = 'free'
  if (priceId === 'pri_01k50r1ab8xr3vzbh8q4rgt06s') planType = 'pro_monthly'
  else if (priceId === 'pri_01k50r48tjn4ppyxmq6tkmrxaa') planType = 'pro_yearly'
  else if (priceId === 'pri_01k4expr4yywz3g9sste7t34px') planType = 'lifetime'

  // Update user subscription
  await updateUserSubscription(userId, {
    id: eventData.id,
    status: 'active',
    items: items,
    current_billing_period: eventData.current_billing_period,
    created_at: eventData.created_at,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('paddle-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify webhook signature
    if (!verifyPaddleSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event_type) {
      case 'subscription.created':
        await handleSuccessfulPayment(event.data)
        break
      
      case 'subscription.updated':
        // Handle subscription changes (upgrades, downgrades, etc.)
        if (event.data.custom_data?.user_id) {
          await updateUserSubscription(event.data.custom_data.user_id, event.data)
        }
        break
      
      case 'subscription.canceled':
        // Handle subscription cancellation
        if (event.data.custom_data?.user_id) {
          await updateUserSubscription(event.data.custom_data.user_id, {
            ...event.data,
            status: 'canceled'
          })
        }
        break
      
      case 'subscription.paused':
        // Handle subscription pause
        if (event.data.custom_data?.user_id) {
          await updateUserSubscription(event.data.custom_data.user_id, {
            ...event.data,
            status: 'paused'
          })
        }
        break
      
      case 'subscription.resumed':
        // Handle subscription resume
        if (event.data.custom_data?.user_id) {
          await updateUserSubscription(event.data.custom_data.user_id, {
            ...event.data,
            status: 'active'
          })
        }
        break
      
      default:
        // Unhandled event type
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
