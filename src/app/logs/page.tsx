'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import AppNavbar from '@/components/AppNavbar'
import { useRecentSessions, useUser } from '@/lib/hooks'
import { Session } from '@/lib/skillsService'
import { getUserCurrentTimezone } from '@/lib/timezoneUtils'

export default function LogsPage() {
  const [userTimezone, setUserTimezone] = useState<string>('')
  const [groupedSessions, setGroupedSessions] = useState<Record<string, Session[]>>({})
  
  const { data: user, isLoading: isLoadingUser } = useUser()
  const { data: sessions = [], isLoading: isLoadingSessions } = useRecentSessions(1000) // Get all sessions
  const router = useRouter()
  
  const isLoading = isLoadingUser || isLoadingSessions

  // Get user's current timezone automatically
  useEffect(() => {
    const currentTimezone = getUserCurrentTimezone()
    setUserTimezone(currentTimezone)
  }, [])

  // Group sessions by date
  useEffect(() => {
    if (sessions.length > 0) {
      const grouped = sessions.reduce((acc, session) => {
        const sessionDate = new Date(session.created_at)
        let dateKey: string
        
        // Convert to user's timezone if specified
        if (userTimezone && userTimezone !== 'UTC') {
          try {
            const timezoneDate = sessionDate.toLocaleString('en-US', { 
              timeZone: userTimezone,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
            dateKey = timezoneDate
          } catch (error) {
            console.warn('Error converting timezone in LogsPage, using UTC:', error)
            dateKey = sessionDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          }
        } else {
          dateKey = sessionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        }
        
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(session)
        return acc
      }, {} as Record<string, Session[]>)
      
      setGroupedSessions(grouped)
    }
  }, [sessions, userTimezone])

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

  const formatTime = (dateString: string): string => {
    const sessionDate = new Date(dateString)
    
    // Convert to user's timezone if specified
    if (userTimezone && userTimezone !== 'UTC') {
      try {
        return sessionDate.toLocaleString('en-US', { 
          timeZone: userTimezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      } catch (error) {
        console.warn('Error converting timezone in LogsPage, using UTC:', error)
        return sessionDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }
    } else {
      return sessionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const formatDateHeader = (dateKey: string): string => {
    const [month, day, year] = dateKey.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    // Return formatted date
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTotalMinutesForDate = (sessions: Session[]): number => {
    return sessions.reduce((total, session) => total + session.duration_min, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#13133c] text-white">
        <AppNavbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-gray-600 rounded w-1/3 animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-600 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="bg-[#1d1d4e] rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-[#13133c] text-white">
        <AppNavbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Activity Yet</h2>
            <p className="text-gray-400 mb-6">Start your first focus session to see your activity history here.</p>
            <button
              onClick={() => router.push('/app')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Start Timer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Activity Logs - View Your Focus Session History | FocusDot</title>
        <meta name="description" content="View your complete focus session history and activity logs. Track your deep work progress, session durations, and productivity patterns over time." />
        <meta name="keywords" content="focus session logs, activity history, deep work tracking, session analytics, productivity logs, focus timer history, study session logs" />
        <link rel="canonical" href="https://focusdot.app/logs" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Activity Logs - View Your Focus Session History" />
        <meta property="og:description" content="View your complete focus session history and activity logs. Track your deep work progress and productivity patterns." />
        <meta property="og:url" content="https://focusdot.app/logs" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Activity Logs - View Your Focus Session History" />
        <meta name="twitter:description" content="View your complete focus session history and activity logs. Track your deep work progress and productivity patterns." />
        <meta name="twitter:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "FocusDot Activity Logs",
              "description": "Activity logs and session history for FocusDot users",
              "url": "https://focusdot.app/logs",
              "isPartOf": {
                "@type": "WebApplication",
                "name": "FocusDot",
                "url": "https://focusdot.app"
              },
              "author": {
                "@type": "Organization",
                "name": "FocusDot Team"
              }
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-[#13133c] text-white">
        <AppNavbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity Logs</h1>
          <p className="text-gray-400">Your complete focus session history</p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedSessions)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // Sort by date, newest first
            .map(([dateKey, dateSessions]) => {
              const totalMinutes = getTotalMinutesForDate(dateSessions)
              const totalHours = Math.floor(totalMinutes / 60)
              const remainingMinutes = totalMinutes % 60
              const totalTimeText = totalHours > 0 
                ? `${totalHours}h ${remainingMinutes}m` 
                : `${remainingMinutes}m`

              return (
                <div key={dateKey} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      {formatDateHeader(dateKey)}
                    </h2>
                    <div className="text-sm text-gray-400">
                      {dateSessions.length} session{dateSessions.length !== 1 ? 's' : ''} • {totalTimeText}
                    </div>
                  </div>

                  {/* Sessions for this date */}
                  <div className="space-y-3">
                    {dateSessions.map((session) => (
                      <div key={session.id} className="bg-[#1d1d4e] rounded-lg p-4 hover:bg-[#2a2a5a] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Session icon */}
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            
                            <div>
                              <div className="text-white font-medium">
                                {formatDuration(session.duration_min)} of deep work
                                {session.skills?.name && (
                                  <span className="text-gray-300"> in {session.skills.name}</span>
                                )}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {formatTime(session.created_at)}
                                {session.note && (
                                  <span className="ml-2">• {session.note}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              {formatDuration(session.duration_min)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
      </div>
    </>
  )
}
