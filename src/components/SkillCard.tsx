'use client'

import React from 'react'

import { Skill } from '@/lib/skillsService'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  // For now, we'll show basic skill info since we don't have hours/goals yet
  // You can extend this later to include progress tracking

  return (
    <div className="bg-[#2A2773] rounded-xl p-5 flex items-center space-x-4 shadow-md">
      {/* Icon placeholder */}
      <div className="w-12 h-12 bg-white rounded-md" />

      {/* Skill info */}
      <div className="flex-1">
        <p className="font-semibold text-white">{skill.name}</p>
        <p className="text-xs text-gray-300 mt-1">
          Created {new Date(skill.created_at).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Click to start a session
        </p>
      </div>
    </div>
  )
}
