'use client'

import { useState, useEffect } from 'react'
import AppNavbar from '@/components/AppNavbar'
import { useUser } from '@/lib/hooks'
import { supabaseClient } from '@/lib/supabaseClient'

interface FocusScoreData {
  concentrationPowerScore: number
  changeFromLastWeek: number
  longestSessionMinutes: number
  consistencyDays: number
  completionRate: number
}

export default function FocusScorePage() {
  const { data: user } = useUser()
  const [focusScoreData, setFocusScoreData] = useState<FocusScoreData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      calculateFocusScore(user.id)
    }
  }, [user?.id])

  const calculateFocusScore = async (userId: string) => {
    try {
      setIsLoading(true)
      
      // Get sessions from last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data: currentWeekSessions, error: currentError } = await supabaseClient
        .from('sessions')
        .select('duration_min, created_at')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (currentError) {
        console.error('Error fetching current week sessions:', currentError)
        return
      }

      // Get sessions from previous 7 days
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
      
      const { data: previousWeekSessions, error: previousError } = await supabaseClient
        .from('sessions')
        .select('duration_min, created_at')
        .eq('user_id', userId)
        .gte('created_at', fourteenDaysAgo.toISOString())
        .lt('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (previousError) {
        console.error('Error fetching previous week sessions:', previousError)
        return
      }

      // Calculate current week score
      const currentScore = calculateConcentrationPowerScore(currentWeekSessions || [])
      
      // Calculate previous week score
      const previousScore = calculateConcentrationPowerScore(previousWeekSessions || [])
      
      // Calculate change
      const change = currentScore.concentrationPowerScore - previousScore.concentrationPowerScore

      setFocusScoreData({
        ...currentScore,
        changeFromLastWeek: change
      })
    } catch (error) {
      console.error('Error calculating focus score:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateConcentrationPowerScore = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) {
      return {
        concentrationPowerScore: 0,
        longestSessionMinutes: 0,
        consistencyDays: 0,
        completionRate: 0
      }
    }

    // 1. Longest Session Score (0-100)
    const longestSessionMinutes = Math.max(...sessions.map(s => s.duration_min || 0))
    const longestSessionScore = longestSessionMinutes < 10 
      ? 0 
      : Math.min((longestSessionMinutes / 90) * 100, 100)

    // 2. Consistency Score (0-100)
    const uniqueDays = new Set(sessions.map(s => new Date(s.created_at).toDateString())).size
    const consistencyScore = (uniqueDays / 7) * 100

    // 3. Completion Rate Score (0-100)
    // Assume common timer values: 30min, 60min, 120min
    const commonDurations = [30, 60, 120]
    let totalCompletionRate = 0
    let validSessions = 0

    sessions.forEach(session => {
      const actualDuration = session.duration_min || 0
      if (actualDuration > 0) {
        // Find closest intended duration
        const intendedDuration = commonDurations.reduce((prev, curr) => 
          Math.abs(curr - actualDuration) < Math.abs(prev - actualDuration) ? curr : prev
        )
        
        const completionRate = Math.min((actualDuration / intendedDuration) * 100, 100)
        totalCompletionRate += completionRate
        validSessions++
      }
    })

    const completionScore = validSessions > 0 ? totalCompletionRate / validSessions : 0

    // 4. Final Score - Weighted Average
    const concentrationPowerScore = Math.round(
      (longestSessionScore * 0.4) + 
      (consistencyScore * 0.3) + 
      (completionScore * 0.3)
    )

    return {
      concentrationPowerScore: Math.min(concentrationPowerScore, 100),
      longestSessionMinutes,
      consistencyDays: uniqueDays,
      completionRate: Math.round(completionScore)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading Focus Score...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <AppNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Focus Score Card */}
        <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
              Focus Score
            </h1>
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Concentration Power Score */}
            <div className="space-y-4">
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Concentration Power Score
              </div>
              <div className="text-6xl font-bold text-white">
                {focusScoreData?.concentrationPowerScore || 0}
              </div>
              <div className="text-gray-300 text-sm">
                Based on: Longest session × consistency × completion rate
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>100 = Elite focus ability (90+ min sessions, daily practice)</div>
                <div>0 = Severe attention issues</div>
              </div>
            </div>

            {/* Right Side - Change Indicator */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Glowing circle background */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 blur-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {focusScoreData?.changeFromLastWeek > 0 ? '+' : ''}{focusScoreData?.changeFromLastWeek?.toFixed(1) || 0}
                    </div>
                    <div className="text-sm text-gray-300">
                      vs. last week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Additional Stats */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {focusScoreData?.longestSessionMinutes || 0}m
                </div>
                <div className="text-sm text-gray-400">Longest Session</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {focusScoreData?.consistencyDays || 0}/7
                </div>
                <div className="text-sm text-gray-400">Days Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {focusScoreData?.completionRate || 0}%
                </div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
