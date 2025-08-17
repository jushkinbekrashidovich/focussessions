'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import AppNavbar from '@/components/AppNavbar'
import DeepWorkHeatmap from '@/components/DeepWorkHeatmap'
import { skillsService, Skill } from '@/lib/skillsService'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchSkills()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSkills = async () => {
    try {
      const skillsData = await skillsService.getUserSkills()
      setSkills(skillsData)
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#13133c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#13133c] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#13133c] text-white">
      <AppNavbar />
      
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Profile Header */}
        <div className="bg-[#13133C] rounded-xl p-4 mb-4 text-white border border-[#2a2a58]">
          <div className="flex items-center space-x-3">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-100">
              {user.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">
                {user.user_metadata?.full_name || 'User'}
              </h1>
              <p className="text-gray-300 text-sm mb-1">
                {user.email}
              </p>
              
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Share Icon */}
              <button className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>

              {/* Logout Button */}
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mb-4">
          
          <div className="bg-[#13133C] rounded-xl p-3 ">
            <div className="flex justify-between items-center mb-2">
              
            </div>
            
            {/* Heatmap */}
            <DeepWorkHeatmap />
          </div>
        </div>

        {/* Projects Section (Goals) */}
        <div>
          <h2 className="text-xl font-bold mb-3">My Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-[#2A2773] rounded-xl p-2.5 flex items-center space-x-3 shadow-md">
                {/* Goal Icon */}
                <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src="/logo.svg" 
                    alt="Goal Icon"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>

                {/* Skill info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{skill.name}</p>
                  
                  {/* Progress section */}
                  <div className="mt-1.5">
                    <div className="h-1 bg-[#37378a] rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full bg-green-400 transition-all duration-500"
                        style={{ width: '0%' }}
                      />
                    </div>
                    
                    {/* Progress text */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300">
                        0h / {skill.target_hours}h
                      </span>
                      <span className="text-green-400">
                        0%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {skill.description || 'Click to start a session'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
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
              <h3 className="text-lg font-medium text-white mb-2">Logout</h3>
              
              {/* Message */}
              <p className="text-gray-300 mb-6">
                Are you sure you want to logout? You'll need to sign in again to access your profile.
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 border border-[#3A3A4A] text-gray-300 rounded-lg hover:bg-[#3A3A4A] transition-colors"
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
