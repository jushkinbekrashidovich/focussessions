// lib/paddleClient.ts
import { initializePaddle } from '@paddle/paddle-js'

// Initialize Paddle client
const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
console.log('🔍 Debug: Paddle token from env:', paddleToken ? 'Present' : 'Missing')
console.log('🔍 Debug: Token starts with:', paddleToken?.substring(0, 10))

export const paddle = initializePaddle({
  token: paddleToken!,
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production',
})

// Price IDs for your pricing plans (Sandbox)
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'pri_01k4exn0p4wy4w7k0h6tv1tb4d',
  PRO_YEARLY: 'pri_01k4exnwjgfxannn0cm6pgc734',
  LIFETIME: 'pri_01k4expr4yywz3g9sste7t34px',
} as const

// Pricing configuration
export const PRICING = {
  PRO_MONTHLY: {
    price: '1.99',
    currency: 'USD',
    interval: 'month',
  },
  PRO_YEARLY: {
    price: '9.99',
    currency: 'USD',
    interval: 'year',
  },
  LIFETIME: {
    price: '24.99',
    currency: 'USD',
    interval: 'once',
  },
} as const
