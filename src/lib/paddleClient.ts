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

// Price IDs for your pricing plans (Production)
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'pri_01k50r1ab8xr3vzbh8q4rgt06s',
  PRO_YEARLY: 'pri_01k50r48tjn4ppyxmq6tkmrxaa',
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
} as const
