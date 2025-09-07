'use client'

import React from 'react'
import { useDeepWorkStats } from '@/lib/hooks'
import type { DeepWorkStats } from '@/lib/statsService'

interface DeepWorkStatsProps {
  refreshTrigger?: number
}

export default function DeepWorkStats({ refreshTrigger }: DeepWorkStatsProps) {
  // Use React Query hook
  const { data: stats, isLoading } = useDeepWorkStats()

  const formatMonthlyTime = (hours: number, minutes: number): string => {
    if (hours === 0 && minutes === 0) return '0'
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const formatLongestSessionTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours === 0) return `${remainingMinutes} min`
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes} min`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#1d1d4e] p-3 sm:p-6 rounded-xl animate-pulse">
            <div className="h-3 sm:h-4 bg-gray-600 rounded w-3/4 mb-1 sm:mb-2"></div>
            <div className="h-6 sm:h-8 bg-gray-600 rounded w-1/2 mb-1 sm:mb-2"></div>
            <div className="h-1.5 sm:h-2 bg-gray-600 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-[#1d1d4e] p-3 sm:p-6 rounded-xl text-center text-gray-400 text-xs sm:text-sm">
          Failed to load stats
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-6">
      {/* Deep Work This Month */}
      <div className="bg-[#1d1d4e] p-3 sm:p-6 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">⏱️</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300">Deep Work This Month</p>
        </div>
        <h3 className="text-lg sm:text-2xl font-bold">
          {formatMonthlyTime(stats.monthlyHours, stats.monthlyMinutes)}
        </h3>
        <div className="h-1.5 sm:h-2 mt-1 sm:mt-2 bg-[#37378a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${stats.currentMonthProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {stats.currentMonthPassedDays}/{stats.currentMonthTotalDays} 
        </p>
      </div>

      {/* Deep Work Streak */}
      <div className="bg-[#1d1d4e] p-3 sm:p-6 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600">🔥</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300">Deep Work Streak</p>
        </div>
        <h3 className="text-lg sm:text-2xl font-bold">{stats.streak} days</h3>
        <p className="text-xs text-gray-400 mt-1">
          {stats.streak === 0 ? 'Start your streak today!' : 
           stats.streak === 1 ? 'Great start!' : 
           stats.streak < 7 ? 'Building momentum!' :
           stats.streak < 30 ? 'Consistent performer!' :
           'Unstoppable! Keep going!'}
        </p>
      </div>

      {/* Longest Focus Session */}
      <div className="bg-[#1d1d4e] p-3 sm:p-6 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600">🏆</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300">Longest Focus Session</p>
        </div>
        {stats.longestSession ? (
          <>
            <h3 className="text-lg sm:text-2xl font-bold">
              {formatLongestSessionTime(stats.longestSession.duration_min)}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(stats.longestSession.created_at)}
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-400">No sessions yet</h3>
            <p className="text-xs text-gray-400 mt-1">
              Complete your first session to see your record
            </p>
          </>
        )}
      </div>
    </div>
  )
}
