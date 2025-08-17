'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Skill, skillsService } from '@/lib/skillsService'

interface SkillCardProps {
  skill: Skill
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
}

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const [progress, setProgress] = useState<{
    completedHours: number
    targetHours: number
    progressPercentage: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true)
      const progressData = await skillsService.getSkillProgress(skill.id)
      setProgress(progressData)
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
    <div className="bg-[#2A2773] rounded-xl p-5 flex items-center space-x-4 shadow-md relative">
      
      {/* Three-dot menu - top right corner */}
      <div className="absolute top-3 right-3">
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

      {/* Goal Icon - Circle Indicator - Left Side Center */}
      <div className="flex-shrink-0 -ml-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          {/* Progress Ring */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
              {/* Background Circle */}
              <circle
                cx="28"
                cy="28"
                r="25"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="3"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="28"
                cy="28"
                r="25"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${progress ? (progress.progressPercentage / 100) * 157 : 0} 157`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              {progress && progress.progressPercentage >= 100 ? (
                // Completed goal - checkmark
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                // In-progress goal - target icon
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skill info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{skill.name}</p>
        
        {/* Progress section */}
        <div className="mt-3">
          {isLoading ? (
            <div className="h-2 bg-gray-600 rounded-full animate-pulse"></div>
          ) : progress ? (
            <>
              {/* Progress bar */}
              <div className="h-2 bg-[#37378a] rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
              
              {/* Progress text */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300">
                  {progress.completedHours.toFixed(1)}h / {progress.targetHours}h
                </span>
                <span className="text-green-400">
                  {progress.progressPercentage.toFixed(1)}%
                </span>
              </div>
            </>
          ) : (
            <div className="h-2 bg-gray-600 rounded-full"></div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {skill.description || 'Click to start a session'}
        </p>
      </div>
    </div>
  )
}
