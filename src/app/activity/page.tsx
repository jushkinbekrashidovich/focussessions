'use client'

import React, { useState, useEffect } from 'react'
import SkillCard from '@/components/SkillCard'
import AppNavbar from '@/components/AppNavbar'
import AddSkillModal from '@/components/AddSkillModal'
import { skillsService, Skill } from '@/lib/skillsService'


export default function ActivityPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSkills, setIsLoadingSkills] = useState(true)

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setIsLoadingSkills(true)
      const userSkills = await skillsService.getUserSkills()
      setSkills(userSkills)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setIsLoadingSkills(false)
    }
  }

  const handleAddSkill = async (skillName: string) => {
    try {
      setIsLoading(true)
      await skillsService.createSkill(skillName)
      await fetchSkills() // Refresh the skills list
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding skill:', error)
      // You could add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#191847] text-white flex flex-col">
      <AppNavbar />
      <div className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My skills</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4A42E4] hover:bg-[#3b35c6] px-5 py-2 rounded-lg text-sm font-semibold"
          >
            Add new skill
          </button>
        </div>

              {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingSkills ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              Loading skills...
            </div>
          ) : skills.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              No skills yet. Add your first skill to get started!
            </div>
          ) : (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSkill={handleAddSkill}
        isLoading={isLoading}
      />
    </div>
  )
}
