'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { paddle, PRODUCT_IDS } from '@/lib/paddleClient'
import { useUser } from '@/lib/hooks/useAuth'

interface PaddleContextType {
  isPaddleReady: boolean
  openCheckout: (planType: 'PRO_MONTHLY' | 'PRO_YEARLY', userEmail?: string) => Promise<void>
  isLoading: boolean
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined)

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [isPaddleReady, setIsPaddleReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: user } = useUser()

  useEffect(() => {
    // Initialize Paddle
    const initPaddle = async () => {
      try {
        console.log('🔍 Debug: Initializing Paddle...')
        console.log('🔍 Debug: Paddle token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ? 'Present' : 'Missing')
        
        const paddleInstance = await paddle
        console.log('🔍 Debug: Paddle instance received:', paddleInstance)
        
        if (paddleInstance) {
          console.log('✅ Debug: Paddle initialized successfully')
          setIsPaddleReady(true)
        } else {
          console.error('❌ Debug: Paddle instance is null/undefined')
        }
      } catch (error) {
        console.error('❌ Failed to initialize Paddle:', error)
      }
    }

    initPaddle()
  }, [])

  const openCheckout = async (planType: 'PRO_MONTHLY' | 'PRO_YEARLY', userEmail?: string) => {
    console.log('🔍 Debug: openCheckout called with:', { planType, userEmail, isPaddleReady })
    
    if (!isPaddleReady) {
      console.error('❌ Paddle is not ready')
      return
    }

    setIsLoading(true)

    try {
      const productId = PRODUCT_IDS[planType]
      console.log('🔍 Debug: Using product ID:', productId)

      // Prepare checkout data
      const checkoutData = {
        items: [
          {
            priceId: productId,
            quantity: 1,
          },
        ],
        customer: userEmail ? {
          email: userEmail,
        } : undefined,
        customData: user?.id ? {
          user_id: user.id,
        } : undefined,
        allowLogout: false,
        displayMode: 'overlay' as const,
        theme: 'dark' as const,
        locale: 'en' as const,
        // Success URL - redirect after successful payment
        successUrl: `${window.location.origin}/app?payment=success`,
        // Close URL - redirect if user closes checkout
        closeUrl: `${window.location.origin}/pricing`,
      }

      // Open Paddle checkout
      console.log('🔍 Debug: Opening Paddle checkout with data:', checkoutData)
      console.log('🔍 Debug: Current environment:', process.env.NODE_ENV)
      console.log('🔍 Debug: Paddle environment:', process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT)
      
      const paddleInstance = await paddle
      console.log('🔍 Debug: Paddle instance:', paddleInstance)
      console.log('🔍 Debug: Paddle instance methods:', Object.keys(paddleInstance || {}))
      
      if (paddleInstance) {
        try {
          console.log('🔍 Debug: Calling paddleInstance.Checkout.open...')
          await paddleInstance.Checkout.open(checkoutData)
          console.log('✅ Debug: Paddle checkout opened successfully')
        } catch (error) {
          console.error('❌ Paddle checkout error:', error)
          console.error('❌ Error details:', JSON.stringify(error, null, 2))
          alert('Payment failed. Please try again.')
        }
      } else {
        console.error('❌ Paddle instance is null/undefined')
      }
    } catch (error) {
      console.error('Error opening checkout:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PaddleContext.Provider value={{ isPaddleReady, openCheckout, isLoading }}>
      {children}
    </PaddleContext.Provider>
  )
}

export function usePaddle() {
  const context = useContext(PaddleContext)
  if (context === undefined) {
    throw new Error('usePaddle must be used within a PaddleProvider')
  }
  return context
}
