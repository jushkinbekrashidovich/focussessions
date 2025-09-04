// lib/paddleClient.ts
import { initializePaddle } from '@paddle/paddle-js'

// Initialize Paddle client
export const paddle = initializePaddle({
  token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
})

// Product IDs for your pricing plans
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'pro_01k4as74sfrrnyc04sty41fg57',
  PRO_YEARLY: 'pro_01k4as8tj871xh2tsm7zxqpk6h',
  LIFETIME: 'pro_01k4as9xbf715yb60v2ttq7yt6',
} as const

// Pricing configuration
export const PRICING = {
  PRO_MONTHLY: {
    price: '1.90',
    currency: 'USD',
    interval: 'month',
  },
  PRO_YEARLY: {
    price: '20.00',
    currency: 'USD',
    interval: 'year',
  },
  LIFETIME: {
    price: '44.00',
    currency: 'USD',
    interval: 'once',
  },
} as const
