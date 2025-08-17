'use client'

import React, { useState, useEffect } from 'react'
import { Skill, skillsService } from '@/lib/skillsService'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  const [progress, setProgress] = useState<{
    completedHours: number
    targetHours: number
    progressPercentage: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [skill.id])

  const fetchProgress = async () => {
    try {
      setIsLoading(true)
      const progressData = await skillsService.getSkillProgress(skill.id)
      setProgress(progressData)
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#2A2773] rounded-xl p-5 flex items-center space-x-4 shadow-md">
      {/* Goal Image - Always show logo.svg */}
      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src="/logo.svg" 
          alt="Goal Icon"
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Skill info */}
      <div className="flex-1">
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
