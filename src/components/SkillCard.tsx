import React from 'react'

interface SkillCardProps {
  name: string
  hours: number
  goal: number
}

export default function SkillCard({ name, hours, goal }: SkillCardProps) {
  const progress = (hours / goal) * 100

  return (
    <div className="bg-[#2A2773] rounded-xl p-5 flex items-center space-x-4 shadow-md">
      {/* Icon placeholder */}
      <div className="w-12 h-12 bg-white rounded-md" />

      {/* Skill info */}
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <div className="w-full h-2 bg-gray-300 rounded-full mt-1 mb-1 overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-300">
          {hours}/{goal} hours
        </p>
      </div>
    </div>
  )
}
