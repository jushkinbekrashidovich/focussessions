'use client'

import React, { useState } from 'react'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'
import SkillCard from '@/components/SkillCard'
import AppNavbar from '@/components/AppNavbar'
import AddSkillModal from '@/components/AddSkillModal'
import EditGoalModal from '@/components/EditGoalModal'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'
import { Skill } from '@/lib/skillsService'
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/lib/hooks'
import { useSubscriptionStatus } from '@/lib/subscriptionUtils'
import { useRouter } from 'next/navigation'

export default function ActivityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use React Query hooks
  const { data: skills = [], isLoading: isLoadingSkills } = useSkills()
  const createSkillMutation = useCreateSkill()
  const updateSkillMutation = useUpdateSkill()
  const deleteSkillMutation = useDeleteSkill()
  const { isPro, isSubscriptionLoading } = useSubscriptionStatus()
  const router = useRouter()

  const handleAddSkill = async (skillName: string, targetHours: number, description: string) => {
    try {
      setIsLoading(true)
      await createSkillMutation.mutateAsync({ name: skillName, targetHours, description })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding skill:', error)
      // You could add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGoalClick = () => {
    // Check if user is free and already has 1 goal
    if (!isSubscriptionLoading && !isPro && skills.length >= 1) {
      router.push('/pricing')
      return
    }
    
    setIsModalOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsEditModalOpen(true)
  }

  const handleUpdateSkill = async (skillId: string, name: string, targetHours: number, description: string) => {
    try {
      setIsLoading(true)
      await updateSkillMutation.mutateAsync({ skillId, name, targetHours, description })
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
      await deleteSkillMutation.mutateAsync(selectedSkill.id)
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
    <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
      <AppNavbar />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Subscription Info */}
        {!isSubscriptionLoading && !isPro && (
          <div className="mb-8 p-4 bg-[#1d1d4e] rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Free plan: {skills.length}/1 goal used
                </p>
                {skills.length >= 1 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Upgrade to Pro to add unlimited goals
                  </p>
                )}
              </div>
              {skills.length >= 1 && (
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-4 py-2 bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        )}

        {/* Add Goal Button */}
        <div className="mb-8">
          <button 
            onClick={handleAddGoalClick}
            className="bg-[#80e8c8] hover:bg-[#6dd4b8] active:bg-[#5ac0a8] text-[#2d5a4a] px-6 py-3 rounded-full text-sm font-semibold transition-colors flex items-center space-x-2"
          >
            <span>Create Goal</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoadingSkills ? (
            <div className="col-span-full">
              <div className="bg-[#1d1d4e] rounded-xl p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#4A42E4] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading goals...</p>
              </div>
            </div>
          ) : skills.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-[#1d1d4e] rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-[#2a2a58] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No goals yet</h3>
                <p className="text-gray-400 mb-6">Add your first goal to start tracking your focus progress</p>
                <button 
                  onClick={handleAddGoalClick}
                  className="bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Create your first goal
                </button>
              </div>
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
