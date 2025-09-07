// lib/paddleCustomerPortal.ts
import { paddle } from './paddleClient'

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
    console.log('🔍 Debug: Opening Paddle Customer Portal with options:', options)
    
    const paddleInstance = await paddle
    if (!paddleInstance) {
      throw new Error('Paddle is not initialized')
    }

    // Prepare customer portal data
    const portalData = {
      customer: options.customerId ? { id: options.customerId } : undefined,
      customerEmail: options.email,
      returnUrl: options.returnUrl || `${window.location.origin}/app/settings`,
    }

    console.log('🔍 Debug: Customer Portal data:', portalData)

    // Open customer portal
    await paddleInstance.CustomerPortal.open(portalData)
    
    console.log('✅ Customer Portal opened successfully')
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
 * This should be called from a backend API endpoint for security
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    console.log('🔍 Debug: Canceling subscription:', subscriptionId)
    
    // This should be implemented as a backend API call
    // since subscription cancellation requires server-side authentication
    const response = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    const result = await response.json()
    console.log('✅ Subscription canceled successfully:', result)
    return result
  } catch (error) {
    console.error('❌ Error canceling subscription:', error)
    throw error
  }
}
