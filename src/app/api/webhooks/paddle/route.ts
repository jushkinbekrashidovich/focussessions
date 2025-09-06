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
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

// Update user subscription in Supabase
async function updateUserSubscription(userId: string, subscriptionData: Record<string, unknown>) {
  const items = subscriptionData.items as Array<{ price: { id: string } }> | undefined
  const billingPeriod = subscriptionData.current_billing_period as { starts_at: string; ends_at: string } | undefined
  
  // Determine plan type based on price ID
  let planType = 'free'
  const priceId = items?.[0]?.price?.id
  if (priceId === 'pri_01k4exn0p4wy4w7k0h6tv1tb4d') planType = 'pro_monthly'
  else if (priceId === 'pri_01k4exnwjgfxannn0cm6pgc734') planType = 'pro_yearly'
  else if (priceId === 'pri_01k4expr4yywz3g9sste7t34px') planType = 'lifetime'
  
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      paddle_subscription_id: subscriptionData.id as string,
      status: subscriptionData.status as string,
      plan_type: planType,
      current_period_start: billingPeriod?.starts_at,
      current_period_end: billingPeriod?.ends_at,
      created_at: subscriptionData.created_at as string,
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error('Error updating user subscription:', error)
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
  if (priceId === 'pri_01k4exn0p4wy4w7k0h6tv1tb4d') planType = 'pro_monthly'
  else if (priceId === 'pri_01k4exnwjgfxannn0cm6pgc734') planType = 'pro_yearly'
  else if (priceId === 'pri_01k4expr4yywz3g9sste7t34px') planType = 'lifetime'

  console.log(`🔔 Processing subscription for user ${userId}, price ID: ${priceId}, plan: ${planType}`)

  // Update user subscription
  await updateUserSubscription(userId, {
    id: eventData.id,
    status: 'active',
    items: items,
    current_billing_period: eventData.current_billing_period,
    created_at: eventData.created_at,
  })

  console.log(`✅ Payment successful for user ${userId}, plan: ${planType}`)
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received from Paddle')
    console.log('🔔 Request headers:', Object.fromEntries(request.headers.entries()))
    
    const body = await request.text()
    console.log('🔔 Webhook body:', body)
    
    const signature = request.headers.get('paddle-signature')
    console.log('🔔 Webhook signature present:', !!signature)
    console.log('🔔 Webhook signature value:', signature)
    
    if (!signature) {
      console.log('❌ Webhook missing signature')
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
    console.log('🔔 Received Paddle webhook:', event.event_type)
    console.log('🔔 Webhook data:', JSON.stringify(event, null, 2))

    // Handle different event types
    switch (event.event_type) {
      case 'transaction.completed':
        await handleSuccessfulPayment(event.data)
        break
      
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
      
      default:
        console.log(`Unhandled event type: ${event.event_type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
