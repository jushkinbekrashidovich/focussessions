'use client'

import { useState } from 'react'
import TimerBox from '@/components/TimerBox'
import AppNavbar from '@/components/AppNavbar'
import ActivityFeed from '@/components/ActivityFeed'
import DeepWorkStats from '@/components/DeepWorkStats'
import DeepWorkHeatmap from '@/components/DeepWorkHeatmap'

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSessionCompleted = () => {
    setRefreshTrigger((prev: number) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
      <AppNavbar />

      {/* Body */}
      <div className="flex flex-1 p-8 gap-12">
        {/* Left: Timer section */}
        <div className="w-[330px]">
          <TimerBox onSessionCompleted={handleSessionCompleted} />
        </div>

        {/* Right: main dashboard */}
        <div className="flex-1 space-y-12 overflow-auto">
          {/* Stats */}
          <DeepWorkStats refreshTrigger={refreshTrigger} />

          {/* Heatmap */}
          <DeepWorkHeatmap refreshTrigger={refreshTrigger} />

          {/* Activity Feed */}
          <div>
            <h2 className="text-xl mb-4 font-semibold">Your Activity</h2>
            <ActivityFeed maxItems={10} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  )
}
