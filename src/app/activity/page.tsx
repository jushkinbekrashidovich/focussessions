'use client'

import React, { useState, useEffect } from 'react'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'
import SkillCard from '@/components/SkillCard'
import AppNavbar from '@/components/AppNavbar'
import AddSkillModal from '@/components/AddSkillModal'
import EditGoalModal from '@/components/EditGoalModal'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'
import { skillsService, Skill } from '@/lib/skillsService'

export default function ActivityPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
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

  const handleAddSkill = async (skillName: string, targetHours: number, description: string) => {
    try {
      setIsLoading(true)
      await skillsService.createSkill(skillName, targetHours, description)
      await fetchSkills() // Refresh the skills list
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding skill:', error)
      // You could add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsEditModalOpen(true)
  }

  const handleUpdateSkill = async (skillId: string, name: string, targetHours: number, description: string) => {
    try {
      setIsLoading(true)
      await skillsService.updateSkill(skillId, { name, target_hours: targetHours, description })
      await fetchSkills() // Refresh the skills list
      setIsEditModalOpen(false)
      setSelectedSkill(null)
    } catch (error) {
      console.error('Error updating skill:', error)
      // You could add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedSkill) return
    
    try {
      setIsLoading(true)
      await skillsService.deleteSkill(selectedSkill.id)
      await fetchSkills() // Refresh the skills list
      setIsDeleteModalOpen(false)
      setSelectedSkill(null)
    } catch (error) {
      console.error('Error deleting skill:', error)
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
          <h1 className="text-2xl font-bold">My Goals</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4A42E4] hover:bg-[#3b35c6] px-5 py-2 rounded-lg text-sm font-semibold"
          >
            Add new goal
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingSkills ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              Loading goals...
            </div>
          ) : skills.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              No goals yet. Add your first goal to get started!
            </div>
          ) : (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={handleEditSkill}
                onDelete={handleDeleteSkill}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      <AddSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSkill={handleAddSkill}
        isLoading={isLoading}
      />

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedSkill(null)
        }}
        onUpdateGoal={handleUpdateSkill}
        skill={selectedSkill}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedSkill(null)
        }}
        onConfirm={handleConfirmDelete}
        goalName={selectedSkill?.name || ''}
        isLoading={isLoading}
      />
    </div>
  )
}
