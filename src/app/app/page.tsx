'use client'

import TimerBox from '@/components/TimerBox'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-4 border-b border-[#2a2a58]">
        <h1 className="text-2xl font-bold">DeepFocusTimer</h1>
        <nav className="flex items-center gap-8 ml-10 text-sm font-medium text-gray-300">
          <a href="/" className="hover:text-white">Home</a>
          <a href="/activity" className="hover:text-white">My activity</a>
          
         
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-green-400 text-sm">● 01:51:18</span>
          <button className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-md text-sm font-medium">
            Profile
          </button>
        </div>
      </header>

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
