'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { paddle, PRODUCT_IDS } from '@/lib/paddleClient'
import { useUser } from '@/lib/hooks/useAuth'

interface PaddleContextType {
  isPaddleReady: boolean
  openCheckout: (planType: 'PRO_MONTHLY' | 'PRO_YEARLY' | 'LIFETIME', userEmail?: string) => Promise<void>
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
        const paddleInstance = await paddle
        if (paddleInstance) {
          setIsPaddleReady(true)
        }
      } catch (error) {
        console.error('Failed to initialize Paddle:', error)
      }
    }

    initPaddle()
  }, [])

  const openCheckout = async (planType: 'PRO_MONTHLY' | 'PRO_YEARLY' | 'LIFETIME', userEmail?: string) => {
    if (!isPaddleReady) {
      console.error('Paddle is not ready')
      return
    }

    setIsLoading(true)

    try {
      const productId = PRODUCT_IDS[planType]

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
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
        // Success URL - redirect after successful payment
        successUrl: `${window.location.origin}/app?payment=success`,
        // Close URL - redirect if user closes checkout
        closeUrl: `${window.location.origin}/pricing`,
      }

      // Open Paddle checkout
      const paddleInstance = await paddle
      if (paddleInstance) {
        try {
          await paddleInstance.Checkout.open(checkoutData)
        } catch (error) {
          console.error('Paddle checkout error:', error)
          alert('Payment failed. Please try again.')
        }
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
