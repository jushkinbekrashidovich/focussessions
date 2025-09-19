'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppNavbar from '@/components/AppNavbar'
import { useUser, useFocusScore } from '@/lib/hooks'
import { useSubscriptionStatus } from '@/lib/subscriptionUtils'

export default function FocusScorePage() {
  const { data: user } = useUser()
  const { isPro, isSubscriptionLoading } = useSubscriptionStatus()
  const { data: focusScoreData, isLoading } = useFocusScore()
  const [showHelp, setShowHelp] = useState(false)
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191847]">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading Focus Score...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191847]">
      <AppNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Focus Score Card */}
        <div className="relative bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
              Focus Score
            </h1>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="How Focus Score works"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Help Information */}
          {showHelp && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-[#2a2a3a] rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">📈 What Makes Focus Score Higher</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• <strong>Long Sessions:</strong> 90+ minutes = maximum points</li>
                    <li>• <strong>Daily Practice:</strong> Don&apos;t miss any days</li>
                    <li>• <strong>Complete Sessions:</strong> Finish what you start</li>
                    <li>• <strong>Consistency:</strong> Even 30min daily helps</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">📉 What Decreases Focus Score</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• <strong>Missing Days:</strong> Each day off hurts score</li>
                    <li>• <strong>Short Sessions:</strong> Under 10min = 0 points</li>
                    <li>• <strong>Incomplete Sessions:</strong> Starting 2h, doing 30min</li>
                    <li>• <strong>Inconsistent Practice:</strong> Only 2-3 days/week</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 ${!isSubscriptionLoading && !isPro ? 'blur-md' : ''}`}>
            {/* Left Side - Concentration Power Score */}
            <div className="space-y-4">
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                Concentration Power Score
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                {focusScoreData?.concentrationPowerScore || 0}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">
                Based on: Longest session × consistency × completion rate
              </div>
              <div className="text-[11px] sm:text-xs text-gray-400 space-y-1">
                <div>100 = Elite focus ability (90+ min sessions, daily practice)</div>
                <div>0 = Severe attention issues</div>
              </div>
            </div>

            {/* Right Side - Change Indicator */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Glowing circle background */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 blur-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {(focusScoreData?.changeFromLastWeek || 0) > 0 ? '+' : ''}{(focusScoreData?.changeFromLastWeek || 0).toFixed(1)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">
                      vs. last week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Additional Stats */}
          <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700 ${!isSubscriptionLoading && !isPro ? 'blur-md' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {focusScoreData?.longestSessionMinutes || 0}m
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Longest Session</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {focusScoreData?.consistencyDays || 0}/7
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Days Active</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {focusScoreData?.completionRate || 0}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Pro Upgrade Button for Free Users */}
          {!isSubscriptionLoading && !isPro && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => router.push('/pricing')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm shadow-lg"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
