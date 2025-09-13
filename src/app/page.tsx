'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LandingNavbar from '@/components/LandingNavbar'
import { useUser } from '@/lib/hooks'
import { usePaddle } from '@/contexts/PaddleContext'
import Footer from '@/components/Footer'
import Head from 'next/head'


export default function Home() {
  const router = useRouter()
  const { data: user, isLoading } = useUser()
  const { openCheckout, isLoading: isPaddleLoading } = usePaddle()
  const userData = user || null
  const [isYearly, setIsYearly] = useState(true)

  return (
    <>
      <Head>
        <title>FocusDot - Build Unbreakable Concentration Habits | Visual Focus Tracker</title>
        <meta name="description" content="The visual focus tracker built for anyone serious about building unbreakable deep work habits. Track your progress, see your streaks, and stay motivated every single day." />
        <meta name="keywords" content="focus app, concentration tracker, deep work, productivity app, focus habits, pomodoro timer, focus streaks, study timer, work focus, concentration habits" />
        <link rel="canonical" href="https://focusdot.app" />
        
        {/* Open Graph */}
        <meta property="og:title" content="FocusDot - Build Unbreakable Concentration Habits" />
        <meta property="og:description" content="The visual focus tracker built for anyone serious about building unbreakable deep work habits. Track your progress, see your streaks, and stay motivated every single day." />
        <meta property="og:url" content="https://focusdot.app" />
        <meta property="og:image" content="https://focusdot.app/dashboard.jpg" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FocusDot - Build Unbreakable Concentration Habits" />
        <meta name="twitter:description" content="The visual focus tracker built for anyone serious about building unbreakable deep work habits." />
        <meta name="twitter:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FocusDot",
              "description": "The visual focus tracker built for anyone serious about building unbreakable deep work habits. Track your progress, see your streaks, and stay motivated every single day.",
              "url": "https://focusdot.app",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier available with Pro plans starting at $1.99/month"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "2500"
              },
              "author": {
                "@type": "Organization",
                "name": "FocusDot Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "FocusDot",
                "url": "https://focusdot.app"
              },
              "keywords": "focus app, concentration tracker, deep work, productivity app, focus habits, pomodoro timer, focus streaks, study timer, work focus, concentration habits"
            })
          }}
        />
      </Head>
      <LandingNavbar user={userData} />
      {/* Spacing between navbar and first section */}
      <div className="h-40 sm:h-44 md:h-48"></div>
      
      {/* Hero Section */}
      <section className="w-full text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl w-full text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight px-2">
            Deep work is hard
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl px-4 max-w-2xl mx-auto">
            So we built something to make it easier
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-600 h-10 w-32 rounded-full"></div>
            ) : user ? (
              <div className="text-center space-y-3">
                <p className="text-green-400 text-sm sm:text-base font-medium">
                  Welcome back! Time to dive into deep work?
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
      <div className="h-40 sm:h-44 md:h-48"></div>

      {/* Main Value Proposition Section */}
      <section id="demo" className="w-full flex flex-col items-center justify-center bg-[#151515] px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center mb-6 sm:mb-8 px-4">
          Build <span className="relative inline-block">
            <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Focus</span>
          </span> Habits
        </h2>
        <p className="text-gray-400 text-base sm:text-lg text-center mb-8 sm:mb-10 max-w-2xl px-4">
          The visual focus tracker built for anyone serious about building unbreakable deep work habits. Whether you&apos;re studying, working on projects, or developing skills—track your progress, see your streaks, and stay motivated every single day.
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
              Your focus journey, visualized. See your entire year of deep work at a glance. Each day shows your focus intensity, creating a powerful visual motivation to maintain streaks and build lasting habits. Just like GitHub&apos;s contribution graph, but for your focus.
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
            Create custom categories for any project or area you want to improve and track your progress. 
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

      {/* Who This Is For Section */}
      <section id="who-this-is-for" className="w-full px-4 sm:px-6 md:px-40 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 px-4">
            Perfect For
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">People with ADHD who struggle with focus</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                For those whose minds jump between tasks or get easily distracted. This tool helps train your brain to focus better, little by little.
              </p>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Students creating consistent study habits</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Track learning progress and build reliable study routines that actually stick.
              </p>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Professionals who need sustained concentration</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                For important projects that demand uninterrupted focus and high-quality output.
              </p>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Learners developing new skills</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Maintain consistent practice and see your progress over time with visual tracking.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Anyone tired of productivity apps that don&apos;t show long-term progress</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Finally see your focus habits build up over time with clear visual progress and meaningful insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Pricing Section */}
      <section id="pricing" className="w-full px-4 sm:px-6 md:px-40 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-4">
            Build <span className="relative inline-block">
              <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Focus</span>
            </span> Habits
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 mb-8">
            Build discipline, stay consistent, and track your progress visually.
          </p>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-700 rounded-lg p-1 flex">
              <button 
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  isYearly 
                    ? 'text-white bg-purple-600' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly -58%
              </button>
              <button 
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  !isYearly 
                    ? 'text-white bg-purple-600' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">FREE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Free</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$0</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">Forever free</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic focus timer
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Simple progress tracking
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic statistics
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Up to 3 focus categories
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Community support
              </li>
            </ul>
            <button className="w-full border border-gray-600 text-gray-300 font-medium py-2 rounded-md hover:border-gray-500 hover:text-white transition cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">
              {isYearly ? 'Pro Yearly' : 'Pro Monthly'}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">
              {isYearly ? '$9.99' : '$1.99'}
            </p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">
              {isYearly ? 'per year' : 'per month'}
            </p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Free
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics & insights
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited focus categories
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Early access to new features
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
            </ul>
            <button 
              onClick={() => {
                console.log('🔍 Debug: Get Pro button clicked!')
                console.log('🔍 Debug: User:', user)
                console.log('🔍 Debug: isYearly:', isYearly)
                if (!user) {
                  router.push('/login?redirect=/pricing')
                } else {
                  openCheckout(isYearly ? 'PRO_YEARLY' : 'PRO_MONTHLY', user.email)
                }
              }}
              disabled={isPaddleLoading}
              className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaddleLoading ? 'Loading...' : 'Get Pro'}
            </button>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
