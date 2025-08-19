'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import LandingNavbar from '@/components/LandingNavbar'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <LandingNavbar user={user} />
      {/* Spacing between navbar and first section */}
      <div className="h-20 sm:h-24 md:h-28"></div>
      
      {/* First Section */}
      <section className="w-full text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl w-full text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight px-2">
            Train Your Focus
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl px-4 max-w-2xl mx-auto">
            Build discipline, stay consistent, and track your progress visually.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-600 h-10 w-32 rounded-full"></div>
            ) : user ? (
              <div className="text-center space-y-3">
                <p className="text-green-400 text-sm sm:text-base font-medium">
                  Welcome back! Ready to continue your focus journey?
                </p>
                <button
                  onClick={() => router.push('/app')}
                  className="bg-[#4A42E4] hover:bg-[#3b35c6] text-white text-sm font-medium px-6 py-3 sm:py-2 rounded-full transition w-full sm:w-auto"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  console.log('Try Now clicked')
                  router.push('/login')
                }}
                className="bg-white text-black text-sm font-medium px-6 py-3 sm:py-2 rounded-full hover:bg-gray-200 transition w-full sm:w-auto"
              >
                Try Now
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-24 sm:h-28 md:h-32"></div>

      {/* Second Section */}
      <section id="demo" className="w-full flex flex-col items-center justify-center bg-[#151515] px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center mb-6 sm:mb-8 px-4">
          Build <span className="relative inline-block">
            <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Focus Habits</span> That Sticks
          </span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg text-center mb-8 sm:mb-10 max-w-2xl px-4">
          The gamified time-tracking app with a simple interface that helps you stay focused and productive — whether you&apos;re working, studying, or just getting things done, every single day!
        </p>
        <div className="w-full max-w-4xl flex justify-center px-4">
          <div className="w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700">
            <img
              src="/dashboard.jpg"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Features Section */}
      <section id="features" className="w-full flex justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12">
          
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-snug">
              🎯 Focus Timer
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto md:mx-0">
              Start focused work in one click. Choose 30 minutes, 1 hour, 2 hours, or long sessions. The timer automatically enters distraction-free mode to keep you on track.
            </p>
          </div>

          {/* Right: Timer Image */}
          <div className="flex-1 max-w-sm sm:max-w-md md:max-w-lg">
            <img
              src="/timer.jpg"
              alt="Focus Timer Interface"
              className="rounded-2xl sm:rounded-3xl shadow-xl border-2 border-gray-700 w-full"
            />
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Features Section Part 2 */}
      <section className="w-full flex justify-center bg-[#151515] px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center md:items-start gap-8 sm:gap-12">
          
          {/* Left: Heatmap Image */}
          <div className="flex-1 max-w-2xl sm:max-w-4xl md:max-w-6xl">
            <img
              src="/heatmap.jpg"
              alt="Deep Work Heatmap"
              className="rounded-2xl sm:rounded-3xl shadow-xl border-2 border-gray-700 w-full"
            />
          </div>

          {/* Right: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-snug">
             Deep Work Heatmap
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto md:mx-0">
              See your entire year of focus activity at a glance. Each day shows your focus intensity, motivating you to maintain consistency and build lasting habits.
            </p>
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Features Section Part 3 */}
      <section id="featuresp3" className="w-full flex justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12">
          
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-snug">
            Personal Focus Goals
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto md:mx-0">
            Create custom categories like &quot;Math&quot;, &quot;Writing&quot; or some project you want to work on and track your progress in each area. 
            </p>
          </div>

          {/* Right: Profile Image */}
          <div className="flex-1 max-w-xl">
            <img
              src="/profile.jpg"
              alt="Personal Focus Goals"
              className="rounded-2xl sm:rounded-3xl shadow-xl border-2 border-gray-700 w-full"
            />
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Pricing Section */}
      <section id="pricing" className="w-full px-4 sm:px-6 md:px-40 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-4">
            One click to <span className="relative inline-block">
              <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">lifetime discipline</span>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
            This isn&apos;t just a timer app. It helps to boost your productivity. You&apos;ll get more done in a week than most do in a month!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Monthly</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">$1.87/mth</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6">Billed monthly.</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ Access to all basic features</li>
              <li>✔ Basic reporting and analytics</li>
              <li>✔ Up to 10 users</li>
              <li>✔ 20GB/user</li>
              <li>✔ Basic support</li>
            </ul>
            <button className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition">
              Get started
            </button>
          </div>

          {/* Business Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Yearly</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">$9.9/mth</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6">Billed annually.</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ 200+ integrations</li>
              <li>✔ Advanced analytics</li>
              <li>✔ Up to 20 users</li>
              <li>✔ 40GB/user</li>
              <li>✔ Priority support</li>
            </ul>
            <button className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-gray-300 transition">
              Get started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Lifetime</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">$99/mth</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6">Billed annually.</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ Advanced custom fields</li>
              <li>✔ Full audit logs</li>
              <li>✔ Unlimited users</li>
              <li>✔ Unlimited data</li>
              <li>✔ Personalized support</li>
            </ul>
            <button className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition">
              Get started
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
