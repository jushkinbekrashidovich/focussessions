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
}

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const previousPercentageRef = useRef<number>(0)
  const previousLevelRef = useRef<number>(1)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true)
      const progressData = await skillsService.getSkillProgress(skill.id)
      
      // Get sessions for this skill to calculate completed sessions
      const sessions = await sessionsService.getSkillSessions(skill.id)
      const completedSessions = sessions.length
      
      setProgress({
        ...progressData,
        completedSessions
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
      {/* Category Tag */}
      <div className="absolute top-4 left-4">
        <span className="bg-[#80e8c8] text-[#2d5a4a] text-xs font-medium px-3 py-1 rounded-full">
          Focus Goal
        </span>
      </div>

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
      <div className="mt-8 mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{skill.description || 'No description provided'}</p>
      </div>

      {/* Progress Metrics */}
      <div className="space-y-4 mb-6">
        {/* Tasks Completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-sm text-gray-400 font-medium">TASKS COMPLETED</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white">
              {isLoading ? '...' : progress?.completedSessions || 0} of {progress?.completedSessions || 0}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {isLoading ? '...' : '100%'}
            </span>
          </div>
        </div>

        {/* Milestones Completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-400 font-medium">MILESTONES COMPLETED</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white">
              {isLoading ? '...' : progress && computed ? `${computed.level - 1} of ${Math.ceil(progress.targetHours / 10)}` : '0 of 0'}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {isLoading ? '...' : progress && computed ? `${Math.round(((computed.level - 1) / Math.ceil(progress.targetHours / 10)) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Milestone */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Current Milestone</p>
        <p className="text-sm font-medium text-[#80e8c8]">
          {isLoading ? '...' : progress && computed ? `Level ${computed.level}` : 'Level 1'}
        </p>
      </div>

      {/* Overall Completeness */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Overall Completeness</span>
          <span className="text-sm text-white font-medium">
            {isLoading ? '...' : progress ? `${Math.round(progress.progressPercentage)}%` : '0%'}
          </span>
        </div>
        <div className="w-full bg-[#2c2c66] rounded-full h-2">
          <div 
            className="bg-[#80e8c8] h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress?.progressPercentage || 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
