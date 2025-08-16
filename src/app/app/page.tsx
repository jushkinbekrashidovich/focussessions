'use client'

import TimerBox from '@/components/TimerBox'
import AppNavbar from '@/components/AppNavbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
      <AppNavbar />

      {/* Body */}
      <div className="flex flex-1 p-8 gap-12">
        {/* Left: Timer section */}
        <div className="w-[330px]">
          <TimerBox />
        </div>

        {/* Right: main dashboard */}
        <div className="flex-1 space-y-12 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#1d1d4e] p-6 rounded-xl">
              <p className="text-sm mb-2 text-gray-300">Deep Work This Month</p>
              <h3 className="text-2xl font-bold">14 days</h3>
              <div className="h-2 mt-2 bg-[#37378a] rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-indigo-500"></div>
              </div>
            </div>
            <div className="bg-[#1d1d4e] p-6 rounded-xl">
              <p className="text-sm mb-2 text-gray-300">Deep Work Streak</p>
              <h3 className="text-2xl font-bold">8 days</h3>
              <div className="h-2 mt-2 bg-[#37378a] rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-indigo-500"></div>
              </div>
            </div>
            <div className="bg-[#1d1d4e] p-6 rounded-xl">
              <p className="text-sm mb-2 text-gray-300">Missed Days</p>
              <h3 className="text-2xl font-bold">1 / 6 days</h3>
              <div className="h-2 mt-2 bg-[#37378a] rounded-full overflow-hidden">
                <div className="h-full w-[20%] bg-indigo-500"></div>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <h2 className="text-xl mb-4 font-semibold">Your Deep Work</h2>
            <div className="bg-[#1d1d4e] rounded-xl p-6 h-[200px]">
              <div className="text-gray-500 text-center">[Heatmap]</div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-xl mb-4 font-semibold">Your Activity</h2>
            <div className="space-y-3">
              <div className="bg-[#1d1d4e] rounded-lg p-4">You completed 2h 00m - 3 days ago</div>
              <div className="bg-[#1d1d4e] rounded-lg p-4">You completed 1h 20m - 4 days ago</div>
              <div className="bg-[#1d1d4e] rounded-lg p-4">You completed 43m - 5 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
