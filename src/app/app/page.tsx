'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'
import TimerBox from '@/components/TimerBox'
import AppNavbar from '@/components/AppNavbar'
import ActivityFeed from '@/components/ActivityFeed'
import DeepWorkStats from '@/components/DeepWorkStats'
import DeepWorkHeatmap from '@/components/DeepWorkHeatmap'

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()

  // Check for redirect after login
  useEffect(() => {
    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')
    if (redirectAfterLogin && redirectAfterLogin !== '/app') {
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectAfterLogin)
    }
  }, [router])

  const handleSessionCompleted = () => {
    setRefreshTrigger((prev: number) => prev + 1)
  }

  return (
    <>
      <Head>
        <title>Focus Dashboard - Track Your Deep Work Sessions | FocusDot</title>
        <meta name="description" content="Your personal focus dashboard. Track deep work sessions, view progress with visual heatmaps, and build unbreakable concentration habits. Start your focus journey today." />
        <meta name="keywords" content="focus dashboard, deep work tracker, concentration timer, productivity dashboard, focus sessions, study timer, work focus, focus habits" />
        <link rel="canonical" href="https://focusdot.app/app" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Focus Dashboard - Track Your Deep Work Sessions" />
        <meta property="og:description" content="Your personal focus dashboard. Track deep work sessions, view progress with visual heatmaps, and build unbreakable concentration habits." />
        <meta property="og:url" content="https://focusdot.app/app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Focus Dashboard - Track Your Deep Work Sessions" />
        <meta name="twitter:description" content="Your personal focus dashboard. Track deep work sessions, view progress with visual heatmaps, and build unbreakable concentration habits." />
        <meta name="twitter:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "FocusDot Dashboard",
              "description": "Personal focus dashboard for tracking deep work sessions and building concentration habits",
              "url": "https://focusdot.app/app",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free dashboard with Pro features available"
              },
              "featureList": [
                "Focus Timer",
                "Deep Work Heatmap",
                "Progress Tracking",
                "Session Analytics",
                "Activity Feed"
              ],
              "author": {
                "@type": "Organization",
                "name": "FocusDot Team"
              }
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
        <AppNavbar />

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8">
        {/* Timer section - Mobile: full width, Desktop: fixed width */}
        <div className="w-full lg:w-[330px]">
          <TimerBox onSessionCompleted={handleSessionCompleted} />
        </div>

        {/* Main dashboard - Mobile: vertical stack, Desktop: horizontal layout */}
        <div className="flex-1 space-y-6 lg:space-y-8 overflow-auto">
          {/* Stats */}
          <DeepWorkStats refreshTrigger={refreshTrigger} />

          {/* Heatmap */}
          <DeepWorkHeatmap refreshTrigger={refreshTrigger} />

          {/* Activity Feed */}
          <div>
            <div className="flex justify-between items-center mb-3 lg:mb-4">
              <h2 className="text-lg lg:text-xl font-semibold">My Activity</h2>
              <button
                onClick={() => router.push('/logs')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                See all
              </button>
            </div>
            <ActivityFeed maxItems={10} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
