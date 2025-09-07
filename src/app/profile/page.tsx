'use client'

import React, { useState } from 'react'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'
import { User } from '@supabase/supabase-js'
import AppNavbar from '@/components/AppNavbar'
import DeepWorkHeatmap from '@/components/DeepWorkHeatmap'
import SkillProgress from '@/components/SkillProgress'
import { Skill } from '@/lib/skillsService'
import { useRouter } from 'next/navigation'
import { useUser, useSkills } from '@/lib/hooks'

export default function ProfilePage() {
  const router = useRouter()

  // Use React Query hooks
  const { data: user, isLoading: isLoadingUser } = useUser()
  const { data: skills = [], isLoading: isLoadingSkills } = useSkills()
  
  const isLoading = isLoadingUser || isLoadingSkills

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#13133c] text-white flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#13133c] text-white flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#13133c] text-white transition-colors duration-200">
      <AppNavbar />
      
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Profile Header */}
        <div className="bg-[#13133C] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-[#2a2a58] transition-colors duration-200">
          <div className="flex items-start space-x-2 sm:space-x-3">
            {/* Profile Picture */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-purple-100 flex-shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg font-bold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info and Timezone */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold mb-1">
                {user.user_metadata?.full_name || 'User'}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm mb-1">
                {user.email}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Settings Icon */}
              <button 
                onClick={() => router.push('/app/settings')}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-300 transition-colors"
                title="Settings"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mb-3 sm:mb-4">
          
          <div className="bg-[#13133C] rounded-xl p-2 sm:p-3 border border-[#2a2a58] transition-colors duration-200">
            <div className="flex justify-between items-center mb-2">
              
            </div>
            
            {/* Heatmap */}
            <DeepWorkHeatmap />
          </div>
        </div>

        {/* Projects Section (Goals) */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">My Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-[#2A2773] rounded-xl p-2 sm:p-2.5 flex items-center space-x-2 sm:space-x-3 shadow-md border border-transparent transition-colors duration-200">
                {/* Goal Icon */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src="/logo.svg" 
                    alt="Goal Icon"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>

                {/* Skill info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-xs sm:text-sm">{skill.name}</p>
                  
                  {/* Progress section */}
                  <SkillProgress skillId={skill.id} targetHours={skill.target_hours || 0} />

                  <p className="text-xs text-gray-400 mt-1">
                    {skill.description || 'Click to start a session'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
