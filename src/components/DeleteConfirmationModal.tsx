'use client'

import React, { useEffect } from 'react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  goalName: string
  isLoading?: boolean
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, goalName, isLoading = false }: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-[#2A2A3A] rounded-xl p-6 w-full max-w-md mx-4">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-white mb-2">
            Delete Goal
          </h3>

          {/* Message */}
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete <span className="font-semibold text-white">&quot;{goalName}&quot;</span>? 
            This action cannot be undone and will remove all progress data.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#3A3A4A] text-gray-300 rounded-lg hover:bg-[#3A3A4A] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
