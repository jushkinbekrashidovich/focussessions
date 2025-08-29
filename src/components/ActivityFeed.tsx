'use client'

import React, { useState } from 'react'
import { Session } from '@/lib/skillsService'
import { getUserCurrentTimezone } from '@/lib/timezoneUtils'
import { useRecentSessions, useUser } from '@/lib/hooks'

interface ActivityFeedProps {
  maxItems?: number
  refreshTrigger?: number // Add this to trigger refresh from parent
  userTimezone?: string
}

export default function ActivityFeed({ maxItems = 10, refreshTrigger, userTimezone }: ActivityFeedProps) {
  // Use React Query hooks
  const { data: user, isLoading: isLoadingUser } = useUser()
  const { data: sessions = [], isLoading: isLoadingSessions } = useRecentSessions(maxItems)
  
  // Use the timezone from props, fallback to detected timezone if not provided
  const effectiveTimezone = userTimezone || getUserCurrentTimezone()
  
  const isLoading = isLoadingUser || isLoadingSessions

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins}m`
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    let sessionDate = new Date(dateString)
    
    // Convert to user's timezone if specified
    if (effectiveTimezone && effectiveTimezone !== 'UTC') {
      try {
        // Create date string in user's timezone
        const timezoneDate = sessionDate.toLocaleString('en-US', { timeZone: effectiveTimezone })
        sessionDate = new Date(timezoneDate)
      } catch (error) {
        console.warn('Error converting timezone in ActivityFeed, using UTC:', error)
        sessionDate = new Date(dateString)
      }
    }
    
    const diffInMs = now.getTime() - sessionDate.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    // If more than 10 days ago, show date
    if (diffInDays > 10) {
      return sessionDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.')
    }
    
    // If more than 1 day ago, show days
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }
    
    // If more than 1 hour ago, show hours
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    }
    
    // If more than 1 minute ago, show minutes
    if (diffInMinutes > 0) {
      return `${diffInMinutes} min ago`
    }
    
    // If less than 1 minute ago, show seconds
    return `${diffInSeconds} seconds ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#1d1d4e] rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No completed sessions yet.</p>
        <p className="text-sm mt-2">Start a timer to see your activity here!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>
      
      <div className="space-y-6">
        {sessions.map((session, index) => (
          <div key={session.id} className="relative flex items-start space-x-4">
            {/* Circular profile icon */}
            <div className="relative z-10 flex-shrink-0">
              {user?.user_metadata?.avatar_url ? (
                // User's Google OAuth profile picture
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Fallback to gradient avatar with initials
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <div className="text-white">
                You completed {formatDuration(session.duration_min)} of deep work
                {session.skills?.name && (
                  <span className="text-gray-300"> in {session.skills.name}</span>
                )}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {formatTimeAgo(session.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
