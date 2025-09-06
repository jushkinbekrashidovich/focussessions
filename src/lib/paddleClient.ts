// lib/paddleClient.ts
import { initializePaddle } from '@paddle/paddle-js'

// Initialize Paddle client
export const paddle = initializePaddle({
  token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
})

// Product IDs for your pricing plans (Sandbox)
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'pro_01k4ew8qegv120sq7xzesbrrjm',
  PRO_YEARLY: 'pro_01k4ewb3saqmm58dn9v7rwp433',
  LIFETIME: 'pro_01k4ewcvnkm62hhf4ar6kjycxs',
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
