'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks'
import { usePaddle } from '@/contexts/PaddleContext'

export default function PricingContent() {
  const [isYearly, setIsYearly] = useState(true)
  const router = useRouter()
  const { data: user, isLoading } = useUser()
  const { openCheckout, isLoading: isPaddleLoading } = usePaddle()

  return (
    <div className="min-h-screen bg-[#191847] text-white">
      {/* Main Pricing Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Build <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Focus</span> Habits
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Build discipline, stay consistent, and track your progress visually.
          </p>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              <button 
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  isYearly 
                    ? 'text-white bg-purple-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly -20%
              </button>
              <button 
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  !isYearly 
                    ? 'text-white bg-purple-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Basic Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-5xl font-bold text-white">$0</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <p className="text-gray-400 mb-6">Perfect for getting started with focus tracking</p>
            <ul className="space-y-3 text-gray-300 text-sm mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic focus timer
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Simple progress tracking
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic statistics
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Up to 3 focus categories
              </li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg relative">
            <div className="absolute -top-3 -right-3">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {isYearly ? 'Pro Yearly' : 'Pro Monthly'}
            </h3>
            <div className="flex items-baseline mb-4">
              <span className="text-5xl font-bold text-white">
                {isYearly ? '$20' : '$1.9'}
              </span>
              <span className="text-gray-400 ml-2">
                {isYearly ? '/year' : '/month'}
              </span>
            </div>
            <p className="text-gray-400 mb-6">Everything you need for serious focus work</p>
            <ul className="space-y-3 text-gray-300 text-sm mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Free
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics & insights
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited focus categories
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Early access to new features
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
            </ul>
            <button 
              onClick={() => {
                if (!user) {
                  router.push('/login?redirect=/pricing')
                } else {
                  openCheckout(isYearly ? 'PRO_YEARLY' : 'PRO_MONTHLY', user.email)
                }
              }}
              disabled={isPaddleLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaddleLoading ? 'Loading...' : 'Purchase Plan'}
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-white mb-2">Lifetime</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-5xl font-bold text-white">$44</span>
              <span className="text-gray-400 ml-2">one-time</span>
            </div>
            <p className="text-gray-400 mb-6">Pay once, use forever with all features</p>
            <ul className="space-y-3 text-gray-300 text-sm mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Free
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics & insights
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited focus categories
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Early access to new features
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
            </ul>
            <button 
              onClick={() => {
                if (!user) {
                  router.push('/login?redirect=/pricing')
                } else {
                  openCheckout('LIFETIME', user.email)
                }
              }}
              disabled={isPaddleLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaddleLoading ? 'Loading...' : 'Purchase Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
