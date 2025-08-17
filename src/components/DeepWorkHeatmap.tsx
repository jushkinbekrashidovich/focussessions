'use client'

import React, { useState, useEffect } from 'react'
import { sessionsService, Session } from '@/lib/skillsService'

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

  useEffect(() => {
    fetchHeatmapData()
  }, [refreshTrigger])

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
    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1) // January 1st of current year
    const endDate = new Date(currentYear, 11, 31) // December 31st of current year
    
    // Create a map of total session minutes by date
    const sessionMinutes = new Map<string, number>()
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at)
      const dateKey = sessionDate.toISOString().split('T')[0]
      const currentMinutes = sessionMinutes.get(dateKey) || 0
      sessionMinutes.set(dateKey, currentMinutes + session.duration_min)
    })
    
    // Generate data for each day of the whole year
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
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[dayIndex]
  }

  const renderHeatmapGrid = () => {
    if (heatmapData.length === 0) return null

    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    // Calculate grid dimensions - always 52-53 weeks for full year
    const weeks = Math.ceil(totalDays / 7)
    
    const grid: DayData[][] = []
    let currentWeek: DayData[] = []
    
    // Fill the grid
    for (let i = 0; i < totalDays; i++) {
      if (i > 0 && i % 7 === 0) {
        grid.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(heatmapData[i] || { date: '', count: 0, intensity: 0 })
    }
    if (currentWeek.length > 0) {
      grid.push(currentWeek)
    }
    
    // Pad the last week if needed
    while (grid[grid.length - 1]?.length < 7) {
      grid[grid.length - 1].push({ date: '', count: 0, intensity: 0 })
    }

    return (
      <div className="space-y-3">
        {/* Month labels - positioned above the grid */}
        <div className="flex justify-between text-xs text-gray-400 px-2">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="flex-1 text-center">
              {getMonthLabel(i)}
            </span>
          ))}
        </div>
        
        {/* Main grid with day labels */}
        <div className="flex">
          {/* Day labels on the left */}
          <div className="flex flex-col mr-1 space-y-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-4 text-xs text-gray-400 w-4 text-right leading-none">
                {i === 1 ? 'Tues' : i === 3 ? 'Thurs' : i === 5 ? 'Sat' : ''}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex space-x-0.5 ml-3.5">
            {Array.from({ length: weeks }, (_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-0.5">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayData = grid[weekIndex]?.[dayIndex]
                  if (!dayData || !dayData.date) {
                    return <div key={dayIndex} className="w-4 h-4 rounded-sm bg-transparent" />
                  }
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-4 h-4 rounded-sm transition-colors duration-200 ${getIntensityColor(dayData.intensity)}`}
                      title={`${dayData.date}: ${dayData.count < 60 ? `${dayData.count} min` : `${Math.floor(dayData.count / 60)}h ${dayData.count % 60}m`} of deep work`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Color intensity legend - bottom right */}
        <div className="flex justify-end items-center space-x-2 mt-4">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex space-x-1">
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
      <div className="bg-[#1d1d4e] rounded-xl p-6 h-[200px] animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-600 rounded"></div>
      </div>
    )
  }

    return (
    <div>
      <h2 className="text-xl mb-4 font-semibold text-white">Your Deep Work</h2>
      
      {heatmapData.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <p>No deep work data yet.</p>
          <p className="text-sm mt-2">Complete your first session to see your activity heatmap!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {renderHeatmapGrid()}
        </div>
      )}
    </div>
  )
}
