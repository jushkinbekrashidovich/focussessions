'use client'

import React, { useState, useEffect } from 'react'
import { sessionsService, Session } from '@/lib/skillsService'
import { getUserCurrentTimezone } from '@/lib/timezoneUtils'

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
  const [isLoading, setIsLoading] = useState(true)
  const [userTimezone, setUserTimezone] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    // Get user's current timezone automatically
    const currentTimezone = getUserCurrentTimezone()
    setUserTimezone(currentTimezone)
  }, [])

  useEffect(() => {
    fetchHeatmapData()
  }, [refreshTrigger, userTimezone, selectedYear])

  const fetchHeatmapData = async () => {
    try {
      setIsLoading(true)
      const sessions = await sessionsService.getUserSessions()
      const data = generateHeatmapData(sessions)
      setHeatmapData(data)
    } catch (error) {
      console.error('Error fetching heatmap data:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

    const startDate = new Date(selectedYear, 0, 1) // January 1st
    
    // Calculate the first Monday of the year (or the Monday before if Jan 1st is not Monday)
    const firstDayOfYear = startDate.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = firstDayOfYear === 0 ? 6 : firstDayOfYear - 1 // Days to subtract to get to Monday
    
    const firstMonday = new Date(startDate)
    firstMonday.setDate(firstMonday.getDate() - daysToSubtract)
    
    // Calculate total weeks needed (including partial weeks at start/end)
    const endDate = new Date(selectedYear, 11, 31) // December 31st
    const lastDayOfYear = endDate.getDay()
    const daysToAdd = lastDayOfYear === 0 ? 0 : 7 - lastDayOfYear // Days to add to complete the week
    
    const lastSunday = new Date(endDate)
    lastSunday.setDate(lastSunday.getDate() + daysToAdd)
    
    const totalDays = Math.ceil((lastSunday.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.ceil(totalDays / 7)
    
    // Create grid structure - each column represents a week
    const grid: DayData[][] = []
    
    // Fill the grid with data, ensuring proper week alignment starting from Monday
    for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
      const week: DayData[] = []
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDate = new Date(firstMonday)
        currentDate.setDate(firstMonday.getDate() + (weekIndex * 7) + dayIndex)
        
        // Check if this date is within the selected year
        if (currentDate.getFullYear() === selectedYear) {
          const dateKey = currentDate.toISOString().split('T')[0]
          const dayData = heatmapData.find(d => d.date === dateKey)
          if (dayData) {
            week.push(dayData)
          } else {
            week.push({ date: dateKey, count: 0, intensity: 0 })
          }
        } else {
          // This date is outside the selected year (padding)
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
          {/* Day labels on the left - Mon, Tue, Wed, Thu, Fri, Sat, Sun */}
          <div className="flex flex-col mr-0.5 sm:mr-1 space-y-0.5 sm:space-y-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={i} className="h-3 sm:h-4 text-xs text-gray-400 w-8 sm:w-10 text-right leading-none">
                {day}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid - each column is a week */}
          <div className="flex space-x-0.5 ml-2 sm:ml-3.5">
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-0.5">
                {week.map((dayData, dayIndex) => {
                  if (!dayData || !dayData.date) {
                    return <div key={dayIndex} className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-transparent" />
                  }
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-colors duration-200 ${getIntensityColor(dayData.intensity)}`}
                      title={`${dayData.date}: ${dayData.count < 60 ? `${dayData.count} min` : `${Math.floor(dayData.count / 60)}h ${dayData.count % 60}m`} of deep work`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Color intensity legend - bottom right */}
        <div className="flex justify-end items-center space-x-1 sm:space-x-2 mt-2 sm:mt-4">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex space-x-0.5 sm:space-x-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#9195DE]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#7A7FD8]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#6369D2]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#555AB5]"></div>
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
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i
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
        <div className="overflow-x-auto">
          {renderHeatmapGrid()}
        </div>
      )}
    </div>
  )
}
