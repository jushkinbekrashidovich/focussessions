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
      <div className="bg-[#1e1e1e] rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="skillName" className="block text-sm font-medium text-gray-300 mb-3">
              Goal Name
            </label>
            <input
              type="text"
              id="skillName"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A42E4] focus:border-transparent text-base"
              placeholder="Enter your goal name"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="targetHours" className="block text-sm font-medium text-gray-300 mb-3">
              Target Total Hours
            </label>
            <input
              type="number"
              id="targetHours"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A42E4] focus:border-transparent text-base"
              placeholder="Enter target total hours"
              min="1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-3">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A42E4] focus:border-transparent resize-none text-base"
              placeholder="Describe your goal (optional)"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 active:bg-gray-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={!skillName.trim() || !targetHours.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
