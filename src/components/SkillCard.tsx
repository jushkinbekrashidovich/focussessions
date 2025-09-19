'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Skill, skillsService, sessionsService } from '@/lib/skillsService'

interface SkillCardProps {
  skill: Skill
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
}

interface ProgressData {
  completedHours: number
  targetHours: number
  progressPercentage: number
  completedSessions: number
  recentProgress: number // hours in last 7 days
  completionPrediction: string
}

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const previousPercentageRef = useRef<number>(0)
  const previousLevelRef = useRef<number>(1)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const getCompletionPrediction = (recentHours: number, targetHours: number, completedHours: number): string => {
    const remainingHours = targetHours - completedHours
    const dailyTarget = remainingHours / 30 // Assuming 30 days to complete
    const recentDailyAverage = recentHours / 7
    
    if (recentDailyAverage >= dailyTarget * 1.5) return '🔥 Momentum Strong'
    if (recentDailyAverage >= dailyTarget * 1.2) return '⚡ Full Energy'
    if (recentDailyAverage >= dailyTarget * 0.8) return '🌱 Growing Steadily'
    if (recentDailyAverage >= dailyTarget * 0.5) return '⏳ Tight Timing'
    return '🚧 Danger Zone'
  }

  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true)
      const progressData = await skillsService.getSkillProgress(skill.id)
      
      // Get sessions for this skill to calculate completed sessions and recent progress
      const sessions = await sessionsService.getSkillSessions(skill.id)
      const completedSessions = sessions.length
      
      // Calculate recent progress (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentSessions = sessions.filter(session => 
        new Date(session.created_at) >= sevenDaysAgo
      )
      const recentProgress = recentSessions.reduce((sum, session) => sum + session.duration_min, 0) / 60
      
      const completionPrediction = getCompletionPrediction(recentProgress, progressData.targetHours, progressData.completedHours)
      
      setProgress({
        ...progressData,
        completedSessions,
        recentProgress,
        completionPrediction
      })
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setIsLoading(false)
    }
  }, [skill.id])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is inside the dropdown menu
      const target = event.target as Element
      const dropdownMenu = document.querySelector('[data-dropdown-menu]')
      
      if (dropdownMenu && dropdownMenu.contains(target)) {
        return
      }
      
      if (showMenu) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      if (showMenu) {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showMenu])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  // Simple level system: 10 hours per level
  const hoursPerLevel = 10
  const computed = progress
    ? {
        level: Math.floor(progress.completedHours / hoursPerLevel) + 1,
        levelStartHours: Math.floor(progress.completedHours / hoursPerLevel) * hoursPerLevel,
        levelProgressPercent:
          ((progress.completedHours % hoursPerLevel) / hoursPerLevel) * 100,
        hoursToNext:
          hoursPerLevel - (progress.completedHours % hoursPerLevel || 0),
      }
    : null

  // Detect progress increase for micro-animations
  useEffect(() => {
    if (!progress) return
    const currentPct = progress.progressPercentage
    const prevPct = previousPercentageRef.current
    const currentLevel = computed?.level || 1
    const prevLevel = previousLevelRef.current

    if (currentPct > prevPct || currentLevel > prevLevel) {
      setShowCelebrate(true)
      const t = setTimeout(() => setShowCelebrate(false), 1200)
      return () => clearTimeout(t)
    }
  }, [progress, computed?.level])

  useEffect(() => {
    if (!progress) return
    previousPercentageRef.current = progress.progressPercentage
    if (computed?.level) previousLevelRef.current = computed.level
  }, [progress, computed?.level])

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(false)
    onEdit(skill)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(false)
    onDelete(skill)
  }

  return (
    <div className="bg-[#1d1d4e] rounded-xl p-6 border border-[#6d5cf6]/40 relative">
      {/* Three-dot menu - top right corner */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleMenuToggle}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="More options"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div 
            className="absolute right-0 mt-2 w-32 bg-[#1A1A2A] rounded-lg shadow-lg border border-[#3A3A4A] z-[9998]"
            data-dropdown-menu
          >
            <button
              onClick={handleEdit}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#3A3A4A] rounded-t-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#3A3A4A] rounded-b-lg transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Goal Title and Description */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
        <p className="text-gray-400 text-sm">{skill.description || 'No description provided'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Number of completed focus sessions */}
        <div>
          <p className="text-2xl font-bold text-white">
            {isLoading ? '...' : progress?.completedSessions || 0}
          </p>
          <p className="text-sm text-gray-400">Number of completed focus sessions</p>
        </div>

        {/* Finished hours out of target hours */}
        <div>
          <p className="text-2xl font-bold text-white">
            {isLoading ? '...' : progress ? `${progress.completedHours.toFixed(1)}/${progress.targetHours}` : '0/0'}
          </p>
          <p className="text-sm text-gray-400">Finished hours out of target hours</p>
        </div>
      </div>

      {/* Current milestone */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Current milestone</p>
        <p className="text-lg font-semibold text-white">
          {isLoading ? '...' : progress && computed ? `Level ${computed.level}` : 'Level 1'}
        </p>
      </div>

      {/* Completion prediction */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Completion prediction</p>
        <p className="text-lg font-semibold text-white">
          {isLoading ? '...' : progress?.completionPrediction || '🌱 Growing Steadily'}
        </p>
      </div>

      {/* Overall completeness progress bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Overall completeness</span>
          <span className="text-sm text-white font-medium">
            {isLoading ? '...' : progress ? `${progress.progressPercentage.toFixed(1)}%` : '0%'}
          </span>
        </div>
        <div className="w-full bg-[#2c2c66] rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-[#6d5cf6] via-[#8ab4ff] to-[#60a5fa] h-3 rounded-full transition-all duration-700"
            style={{ width: `${progress?.progressPercentage || 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
