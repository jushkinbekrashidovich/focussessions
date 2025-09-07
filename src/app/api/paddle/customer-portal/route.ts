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
    const { customerEmail } = await request.json()
    
    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 })
    }

    console.log('🔍 Debug: Creating customer portal session for:', customerEmail)

    // Get Paddle API credentials
    const paddleApiKey = process.env.PADDLE_API_KEY
    const paddleEnvironment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox'
    
    if (!paddleApiKey) {
      return NextResponse.json({ error: 'Paddle API key not configured' }, { status: 500 })
    }

    // Debug: Log API key format (first few characters only for security)
    console.log('🔍 Debug: Paddle API key format:', paddleApiKey.substring(0, 10) + '...')
    console.log('🔍 Debug: Paddle environment:', paddleEnvironment)
    
    // Validate API key format
    if (!paddleApiKey.startsWith('pdl_')) {
      console.error('❌ Invalid Paddle API key format. Should start with "pdl_"')
      return NextResponse.json({ error: 'Invalid Paddle API key format' }, { status: 500 })
    }

    // First, find the customer by email
    const authHeader = `Bearer ${paddleApiKey}`
    console.log('🔍 Debug: Auth header format:', authHeader.substring(0, 20) + '...')
    
    const customerResponse = await fetch(`https://api.paddle.com/customers?email=${encodeURIComponent(customerEmail)}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text()
      console.error('❌ Error fetching customer:', errorText)
      console.error('❌ Response status:', customerResponse.status)
      console.error('❌ Response headers:', Object.fromEntries(customerResponse.headers.entries()))
      return NextResponse.json({ 
        error: 'Failed to fetch customer from Paddle', 
        details: errorText,
        status: customerResponse.status 
      }, { status: customerResponse.status })
    }

    const customerData = await customerResponse.json()
    const customer = customerData.data?.[0]

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    console.log('🔍 Debug: Found customer:', customer.id)

    // Create customer portal session
    const portalResponse = await fetch(`https://api.paddle.com/customers/${customer.id}/portal-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: `${request.nextUrl.origin}/app/settings`
      })
    })

    if (!portalResponse.ok) {
      console.error('❌ Error creating portal session:', await portalResponse.text())
      return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
    }

    const portalData = await portalResponse.json()
    const portalUrl = portalData.data.url

    console.log('✅ Customer portal URL created:', portalUrl)

    return NextResponse.json({ 
      success: true, 
      portalUrl 
    })

  } catch (error) {
    console.error('❌ Customer portal error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
