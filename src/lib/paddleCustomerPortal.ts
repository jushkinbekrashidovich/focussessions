// lib/paddleCustomerPortal.ts

export interface CustomerPortalOptions {
  customerId?: string
  email?: string
  returnUrl?: string
}

/**
 * Open Paddle Customer Portal for subscription management
 * This allows customers to:
 * - View their subscription details
 * - Update payment methods
 * - Cancel subscriptions
 * - Download invoices
 * - View billing history
 */
export async function openCustomerPortal(options: CustomerPortalOptions = {}) {
  try {
    console.log('🔍 Debug: Opening Customer Portal with options:', options)
    
    // Use static customer portal link from environment variables
    const portalUrl = process.env.NEXT_PUBLIC_PADDLE_CUSTOMER_PORTAL_URL
    
    if (!portalUrl) {
      console.error('❌ Customer portal URL not configured')
      throw new Error('Customer portal URL not configured. Please set NEXT_PUBLIC_PADDLE_CUSTOMER_PORTAL_URL environment variable.')
    }

    console.log('✅ Opening Customer Portal:', portalUrl)
    
    // Open customer portal in new tab
    window.open(portalUrl, '_blank')
    
    return true
  } catch (error) {
    console.error('❌ Error opening Customer Portal:', error)
    throw error
  }
}

/**
 * Get customer information from Paddle
 * This can be used to get customer ID for portal access
 */
export async function getCustomerInfo(customerEmail: string) {
  try {
    console.log('🔍 Debug: Getting customer info for:', customerEmail)
    
    // Note: This would typically require a backend API call to Paddle's API
    // since customer data retrieval requires server-side authentication
    // For now, we'll return a placeholder
    return {
      id: 'customer_' + customerEmail.replace('@', '_'),
      email: customerEmail,
    }
  } catch (error) {
    console.error('❌ Error getting customer info:', error)
    throw error
  }
}

/**
 * Cancel subscription via Paddle API
 * This calls our backend API which handles Paddle integration securely
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    console.log('🔍 Debug: Canceling subscription:', subscriptionId)
    
    if (!subscriptionId) {
      throw new Error('Subscription ID is required')
    }

    // Call our backend API to cancel subscription
    const response = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to cancel subscription')
    }

    const result = await response.json()
    console.log('✅ Subscription canceled successfully:', result)
    
    return result
  } catch (error) {
    console.error('❌ Error canceling subscription:', error)
    throw error
  }
}
