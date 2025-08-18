'use client'

import React, { useState, useEffect } from 'react'
import { statsService } from '@/lib/statsService'
import type { DeepWorkStats } from '@/lib/statsService'

interface DeepWorkStatsProps {
  refreshTrigger?: number
}

export default function DeepWorkStats({ refreshTrigger }: DeepWorkStatsProps) {
  const [stats, setStats] = useState<DeepWorkStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [refreshTrigger])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const deepWorkStats = await statsService.getDeepWorkStats()
      setStats(deepWorkStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatMonthlyTime = (hours: number, minutes: number): string => {
    if (hours === 0 && minutes === 0) return '0'
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#1d1d4e] p-6 rounded-xl animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-600 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#1d1d4e] p-6 rounded-xl text-center text-gray-400">
          Failed to load stats
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Deep Work This Month */}
      <div className="bg-[#1d1d4e] p-6 rounded-xl">
        <p className="text-sm mb-2 text-gray-300">Deep Work This Month</p>
        <h3 className="text-2xl font-bold">
          {formatMonthlyTime(stats.monthlyHours, stats.monthlyMinutes)}
        </h3>
        <div className="h-2 mt-2 bg-[#37378a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${stats.currentMonthProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {stats.currentMonthPassedDays}/{stats.currentMonthTotalDays} 
        </p>
        {stats.totalMonthlyMinutes > 0 && (
          <p className="text-xs text-green-400 mt-1">
            {Math.round((stats.totalMonthlyMinutes / (stats.currentMonthPassedDays * 24 * 60)) * 10) / 10} min/day average
          </p>
        )}
      </div>

      {/* Deep Work Streak */}
      <div className="bg-[#1d1d4e] p-6 rounded-xl">
        <p className="text-sm mb-2 text-gray-300">Deep Work Streak</p>
        <h3 className="text-2xl font-bold">{stats.streak} days</h3>
        <p className="text-xs text-gray-400 mt-1">
          {stats.streak === 0 ? 'Start your streak today!' : 
           stats.streak === 1 ? 'Great start!' : 
           stats.streak < 7 ? 'Building momentum!' :
           stats.streak < 30 ? 'Consistent performer!' :
           'Unstoppable! Keep going!'}
        </p>
      </div>

      {/* Missed Days */}
      <div className="bg-[#1d1d4e] p-6 rounded-xl">
        <p className="text-sm mb-2 text-gray-300">Missed Days This Week</p>
        <h3 className="text-2xl font-bold">
          {stats.missedDaysThisWeek} / {stats.totalDaysThisWeek}
        </h3>
        <div className="h-2 mt-2 bg-[#37378a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${(stats.missedDaysThisWeek / stats.totalDaysThisWeek) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {stats.totalDaysThisWeek - stats.missedDaysThisWeek} days with sessions
        </p>
      </div>
    </div>
  )
}
