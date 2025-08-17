'use client'

import React, { useState } from 'react'

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSkill: (skillName: string, targetHours: number, description: string) => void
  isLoading?: boolean
}

export default function AddSkillModal({ isOpen, onClose, onAddSkill, isLoading = false }: AddSkillModalProps) {
  const [skillName, setSkillName] = useState('')
  const [targetHours, setTargetHours] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (skillName.trim() && targetHours.trim()) {
      const hours = parseInt(targetHours)
      if (hours > 0) {
        onAddSkill(skillName.trim(), hours, description.trim())
        setSkillName('')
        setTargetHours('')
        setDescription('')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2A2A3A] rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Goal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="skillName" className="block text-sm font-medium text-gray-300 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              id="skillName"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#3A3A4A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A42E4] focus:border-transparent"
              placeholder="e.g., Coding, Reading, Design, etc."
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="targetHours" className="block text-sm font-medium text-gray-300 mb-2">
              Target Hours
            </label>
            <input
              type="number"
              id="targetHours"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#3A3A4A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A42E4] focus:border-transparent"
              placeholder="e.g., 10000"
              min="1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#3A3A4A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A42E4] focus:border-transparent resize-none"
              placeholder="e.g., Master React and TypeScript, Read 50 books this year..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#3A3A4A] text-gray-300 rounded-lg hover:bg-[#3A3A4A] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#4A42E4] hover:bg-[#3b35c6] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={!skillName.trim() || !targetHours.trim() || isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
