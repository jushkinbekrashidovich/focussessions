'use client'

import React, { useState, useEffect } from 'react'
import { Session } from '@/lib/skillsService'
import { getUserCurrentTimezone } from '@/lib/timezoneUtils'
import { useSessions } from '@/lib/hooks'
import { useSubscriptionStatus } from '@/lib/subscriptionUtils'
import { useRouter } from 'next/navigation'

interface DeepWorkHeatmapProps {
  refreshTrigger?: number
}

interface DayData {
  date: string
  count: number
  intensity: number // 0-4 for color intensity
}

export default function DeepWorkHeatmap({ refreshTrigger }: DeepWorkHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<DayData[]>([])
  const [userTimezone, setUserTimezone] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const { isPro, isSubscriptionLoading } = useSubscriptionStatus()
  const router = useRouter()

  useEffect(() => {
    // Get user's current timezone automatically
    const currentTimezone = getUserCurrentTimezone()
    setUserTimezone(currentTimezone)
  }, [])

  // Use React Query hook
  const { data: sessions = [], isLoading: isLoadingSessions } = useSessions()

  useEffect(() => {
    if (sessions.length > 0) {
      const data = generateHeatmapData(sessions)
      setHeatmapData(data)
    }
  }, [sessions, userTimezone, selectedYear])

  const isLoading = isLoadingSessions

  const generateHeatmapData = (sessions: Session[]): DayData[] => {
    const data: DayData[] = []
    
    // Create a map of total session minutes by date in user's timezone
    const sessionMinutes = new Map<string, number>()
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at)
      
      // Convert to user's timezone if specified
      let localDate: Date
      if (userTimezone && userTimezone !== 'UTC') {
        try {
          // Create date string in user's timezone
          const timezoneDate = sessionDate.toLocaleString('en-US', { timeZone: userTimezone })
          localDate = new Date(timezoneDate)
        } catch (error) {
          console.warn('Error converting timezone in DeepWorkHeatmap, using UTC:', error)
          localDate = sessionDate
        }
      } else {
        localDate = sessionDate
      }
      
      const dateKey = localDate.toISOString().split('T')[0]
      const currentMinutes = sessionMinutes.get(dateKey) || 0
      sessionMinutes.set(dateKey, currentMinutes + session.duration_min)
    })
    
    // Generate data for each day of the selected year (365 or 366 days)
    // Start from January 1st and go through December 31st
    const startDate = new Date(selectedYear, 0, 1) // January 1st
    const endDate = new Date(selectedYear, 11, 31) // December 31st
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0]
      const totalMinutes = sessionMinutes.get(dateKey) || 0
      
      // Calculate intensity (0-4) based on total session minutes
      let intensity = 0
      if (totalMinutes > 0 && totalMinutes < 60) intensity = 1      // Any minutes (1-59 min)
      else if (totalMinutes >= 60 && totalMinutes < 120) intensity = 2 // 1-2 hours
      else if (totalMinutes >= 120 && totalMinutes < 240) intensity = 3 // 2-4 hours
      else if (totalMinutes >= 240) intensity = 4                      // 4+ hours
      
      data.push({
        date: dateKey,
        count: totalMinutes, // Keep as minutes for accurate display
        intensity
      })
    }
    
    return data
  }

  const getIntensityColor = (intensity: number): string => {
    switch (intensity) {
      case 0: return 'bg-[#33325E]' // No sessions - darkest, blends with background
      case 1: return 'bg-[#9195DE]' // 1 session - light purple
      case 2: return 'bg-[#7A7FD8]' // 2 sessions - medium purple
      case 3: return 'bg-[#6369D2]' // 3 sessions - darker purple
      case 4: return 'bg-[#555AB5]' // 4+ sessions - darkest purple
      default: return 'bg-[#33325E]'
    }
  }

  const getMonthLabel = (monthIndex: number): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[monthIndex]
  }

  const getDayLabel = (dayIndex: number): string => {
    // Start from Monday (1) to Sunday (0)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[dayIndex]
  }

  const renderHeatmapGrid = () => {
    if (heatmapData.length === 0) return null

    // Simple approach: Create a grid that starts exactly from January 1st
    // Each column represents a week, each row represents a day of the week
    
    // Calculate the day of week for January 1st (0 = Sunday, 1 = Monday, etc.)
    const januaryFirst = new Date(selectedYear, 0, 1)
    const firstDayOfWeek = januaryFirst.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Convert to Monday-based week (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
    const mondayBasedDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    
    // Calculate total weeks needed (52 or 53 weeks)
    const totalWeeks = 53
    
    // Create grid structure
    const grid: DayData[][] = []
    
    // Fill the grid week by week
    for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
      const week: DayData[] = []
      
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        // Calculate the actual date for this grid position
        let actualDate: Date
        
        if (weekIndex === 0 && dayIndex < mondayBasedDay) {
          // This is before January 1st - empty cell
          week.push({ date: '', count: 0, intensity: 0 })
          continue
        } else {
          // Calculate the actual date
          const daysFromStart = (weekIndex * 7) + dayIndex - mondayBasedDay
          actualDate = new Date(selectedYear, 0, 1)
          actualDate.setDate(1 + daysFromStart)
        }
        
        // Check if this date is within the selected year
        if (actualDate.getFullYear() === selectedYear) {
          const dateKey = actualDate.toISOString().split('T')[0]
          const dayData = heatmapData.find(d => d.date === dateKey)
          if (dayData) {
            week.push(dayData)
          } else {
            week.push({ date: dateKey, count: 0, intensity: 0 })
          }
        } else {
          // This date is outside the selected year
          week.push({ date: '', count: 0, intensity: 0 })
        }
      }
      
      grid.push(week)
    }

    return (
      <div className="space-y-2 sm:space-y-3">
        {/* Month labels - positioned above the grid */}
        <div className="flex justify-between text-xs text-gray-400 px-1 sm:px-2">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="flex-1 text-center text-xs">
              {getMonthLabel(i)}
            </span>
          ))}
        </div>
        
        {/* Main grid with day labels */}
        <div className="flex">
          {/* Day labels on the left - positioned to align with correct rows */}
          <div className="flex flex-col mr-1 space-y-0.5">
            {/* Empty space for row 1 (Sun) */}
            <div className="h-3 sm:h-4"></div>
            {/* Tue - row 2 */}
            <div className="h-3 sm:h-4 text-xs text-gray-400 w-8 sm:w-10 text-right leading-none flex items-center justify-end">
              Tue
            </div>
            {/* Empty space for row 3 (Wed) */}
            <div className="h-3 sm:h-4"></div>
            {/* Thu - row 4 */}
            <div className="h-3 sm:h-4 text-xs text-gray-400 w-8 sm:w-10 text-right leading-none flex items-center justify-end">
              Thu
            </div>
            {/* Empty space for row 5 (Fri) */}
            <div className="h-3 sm:h-4"></div>
            {/* Sat - row 6 */}
            <div className="h-3 sm:h-4 text-xs text-gray-400 w-8 sm:w-10 text-right leading-none flex items-center justify-end">
              Sat
            </div>
            {/* Empty space for row 7 (Sun) */}
            <div className="h-3 sm:h-4"></div>
          </div>
          
          {/* Heatmap grid - each column is a week */}
          <div className="flex space-x-0.5 ml-2 sm:ml-3.5">
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-0.5">
                {week.map((dayData, dayIndex) => {
                  if (!dayData || !dayData.date) {
                    return <div key={dayIndex} className="w-3 h-3 rounded-sm bg-transparent" />
                  }
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm transition-colors duration-200 ${getIntensityColor(dayData.intensity)}`}
                      title={`${dayData.date}: ${dayData.count < 60 ? `${dayData.count} min` : `${Math.floor(dayData.count / 60)}h ${dayData.count % 60}m`} of deep work`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Color intensity legend - bottom right */}
        <div className="flex justify-end items-center space-x-1 mt-2">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex space-x-0.5">
            <div className="w-3 h-3 rounded-sm bg-[#9195DE]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#7A7FD8]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#6369D2]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#555AB5]"></div>
          </div>
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-[#1d1d4e] rounded-xl p-3 sm:p-6 h-[150px] sm:h-[200px] animate-pulse transition-colors duration-200">
        <div className="h-3 sm:h-4 bg-gray-600 rounded w-1/3 mb-2 sm:mb-4"></div>
        <div className="h-24 sm:h-32 bg-gray-600 rounded"></div>
      </div>
    )
  }

    return (
    <div>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white transition-colors duration-200">My Deep Work</h2>
        
        {/* Year Selection */}
        <div className="flex items-center space-x-2">
          <label htmlFor="year-select" className="text-xs text-gray-400">Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#26265e] text-white text-xs px-2 py-1 rounded border border-[#37378a] focus:outline-none focus:border-indigo-500"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = 2024 + i
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      
      {heatmapData.length === 0 ? (
        <div className="text-gray-500 text-center py-6 sm:py-8 transition-colors duration-200">
          <p className="text-sm sm:text-base">No deep work data yet.</p>
          <p className="text-xs sm:text-sm mt-2">Complete your first session to see your activity heatmap!</p>
        </div>
      ) : (
        <div className="relative">
          <div className={`overflow-x-auto ${!isSubscriptionLoading && !isPro ? 'blur-sm' : ''}`}>
            {renderHeatmapGrid()}
          </div>
          
          {/* Pro Upgrade Button for Free Users */}
          {!isSubscriptionLoading && !isPro && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => router.push('/pricing')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm shadow-lg"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
