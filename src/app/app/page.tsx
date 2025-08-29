'use client'

import { useState } from 'react'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'
import TimerBox from '@/components/TimerBox'
import AppNavbar from '@/components/AppNavbar'
import ActivityFeed from '@/components/ActivityFeed'
import DeepWorkStats from '@/components/DeepWorkStats'
import DeepWorkHeatmap from '@/components/DeepWorkHeatmap'
import { useUserPreferences } from '@/lib/hooks'

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { currentTimezone } = useUserPreferences()

  const handleSessionCompleted = () => {
    setRefreshTrigger((prev: number) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
      <AppNavbar />

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 sm:p-6 lg:p-8 gap-6 lg:gap-12">
        {/* Timer section - Mobile: full width, Desktop: fixed width */}
        <div className="w-full lg:w-[330px]">
          <TimerBox onSessionCompleted={handleSessionCompleted} />
        </div>

        {/* Main dashboard - Mobile: vertical stack, Desktop: horizontal layout */}
        <div className="flex-1 space-y-6 lg:space-y-12 overflow-auto">
          {/* Stats */}
          <DeepWorkStats refreshTrigger={refreshTrigger} />

          {/* Heatmap */}
          <DeepWorkHeatmap refreshTrigger={refreshTrigger} userTimezone={currentTimezone} />

          {/* Activity Feed */}
          <div>
            <h2 className="text-lg lg:text-xl mb-3 lg:mb-4 font-semibold">My Activity</h2>
            <ActivityFeed maxItems={10} refreshTrigger={refreshTrigger} userTimezone={currentTimezone} />
          </div>
        </div>
      </div>
    </div>
  )
}
