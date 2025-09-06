'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks'
import { usePaddle } from '@/contexts/PaddleContext'

export default function PricingContent() {
  const router = useRouter()
  const { data: user, isLoading } = useUser()
  const { openCheckout, isLoading: isPaddleLoading } = usePaddle()

  return (
    <div className="w-full px-4 sm:px-6 md:px-40 py-12 sm:py-16 md:py-20 bg-[#13133c]">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-4">
          <span className="relative inline-block">
            <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Build Better Focus Habits</span>
          </span>
        </h2>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
          Build discipline, stay consistent, and track your progress visually.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {/* Free Plan */}
        <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-4">
            <span className="inline-block bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">FREE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Free</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$0</p>
          <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">Forever free</p>
          <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
            <li>✔ Basic focus timer</li>
            <li>✔ Simple progress tracking</li>
            <li>✔ Basic statistics</li>
            <li>✔ Up to 3 focus categories</li>
            <li>✔ Community support</li>
          </ul>
          <button className="w-full border border-gray-600 text-gray-300 font-medium py-2 rounded-md hover:border-gray-500 hover:text-white transition cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Pro Monthly Plan */}
        <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Pro Monthly</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$1.9</p>
          <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">per month</p>
          <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
            <li>✔ Everything in Free</li>
            <li>✔ Advanced analytics & insights</li>
            <li>✔ Unlimited focus categories</li>
            <li>✔ Custom focus goals</li>
            <li>✔ Priority support</li>
          </ul>
          <button 
            onClick={() => {
              if (!user) {
                router.push('/login?redirect=/pricing')
              } else {
                openCheckout('PRO_MONTHLY', user.email)
              }
            }}
            disabled={isPaddleLoading}
            className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaddleLoading ? 'Loading...' : 'Get Pro'}
          </button>
        </div>

        {/* Pro Yearly Plan */}
        <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-md relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Pro Yearly</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$20</p>
          <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">per year</p>
          <p className="text-xs text-green-400 mb-4 text-center">Save 12% vs monthly</p>
          <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
            <li>✔ Everything in Pro Monthly</li>
            <li>✔ Early access to new features</li>
            <li>✔ Advanced focus insights</li>
            <li>✔ Priority support</li>
          </ul>
          <button 
            onClick={() => {
              if (!user) {
                router.push('/login?redirect=/pricing')
              } else {
                openCheckout('PRO_YEARLY', user.email)
              }
            }}
            disabled={isPaddleLoading}
            className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaddleLoading ? 'Loading...' : 'Get Pro Yearly'}
          </button>
        </div>

        {/* Lifetime Plan */}
        <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-4">
            <span className="inline-block bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">LIMITED</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Lifetime</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$44</p>
          <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">One-time payment</p>
          <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
            <li>✔ Everything in Pro Yearly</li>
            <li>✔ All future features included</li>
            <li>✔ Lifetime updates</li>
            <li>✔ Premium support</li>
            <li>✔ No recurring fees</li>
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
            className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaddleLoading ? 'Loading...' : 'Get Lifetime'}
          </button>
        </div>
      </div>
    </div>
  )
}
