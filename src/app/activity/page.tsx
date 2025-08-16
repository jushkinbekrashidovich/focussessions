'use client'

import React from 'react'
import SkillCard from '@/components/SkillCard'


export default function ActivityPage() {
  const skills = [
    { id: 1, name: 'Coding', hours: 122, goal: 3000 },
    { id: 2, name: 'Reading', hours: 80, goal: 1000 },
    { id: 3, name: 'Design', hours: 60, goal: 500 },
    { id: 4, name: 'Music', hours: 45, goal: 200 },
    { id: 5, name: 'Workout', hours: 30, goal: 100 },
    { id: 6, name: 'Language', hours: 20, goal: 150 },
  ]

  return (
    <div className="min-h-screen bg-[#191847] text-white px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My skills</h1>
        <button className="bg-[#4A42E4] hover:bg-[#3b35c6] px-5 py-2 rounded-lg text-sm font-semibold">
          Add new skill
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            name={skill.name}
            hours={skill.hours}
            goal={skill.goal}
          />
        ))}
      </div>
    </div>
  )
}
