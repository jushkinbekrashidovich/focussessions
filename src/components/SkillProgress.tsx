'use client'

import React from 'react'
import { useSkillProgress } from '@/lib/hooks'

interface SkillProgressProps {
  skillId: string
  targetHours: number
}

export default function SkillProgress({ skillId, targetHours }: SkillProgressProps) {
  const { data: progress, isLoading } = useSkillProgress(skillId)
  
  if (isLoading) {
    return (
      <div className="mt-1 sm:mt-1.5">
        <div className="h-1 bg-[#37378a] rounded-full overflow-hidden mb-1 animate-pulse">
          <div className="h-full bg-gray-600 rounded-full" style={{ width: '50%' }} />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300">--h / {targetHours}h</span>
          <span className="text-green-400">--%</span>
        </div>
      </div>
    )
  }

  const completedHours = progress?.completedHours || 0
  const progressPercentage = Math.min((completedHours / (targetHours || 1)) * 100, 100)

  return (
    <div className="mt-1 sm:mt-1.5">
      <div className="h-1 bg-[#37378a] rounded-full overflow-hidden mb-1">
        <div 
          className="h-full bg-green-400 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Progress text */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-300">
          {completedHours}h / {targetHours}h
        </span>
        <span className="text-green-400">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  )
}
