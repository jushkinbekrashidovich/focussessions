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
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = ['/focusscore.jpg', '/deepwork.jpg', '/dashboard.jpg', '/profile.png']

  // Auto-advance carousel
  if (typeof window !== 'undefined') {
    // lightweight interval without useEffect to avoid SSR mismatch warnings in simple client page
    // ensure one interval only
    // @ts-expect-error - augment window to store a singleton interval id
    if (!window.__focusdot_carousel_interval__) {
      // @ts-expect-error - define custom property to avoid multiple intervals
      window.__focusdot_carousel_interval__ = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length)
      }, 3500)
    }
  }

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
      <div className="h-16"></div>
      
      {/* Hero Section */}
      <section className="w-full text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-16 bg-gradient-to-b from-black via-[#0f0f14] to-[#151515]">
        <div className="max-w-4xl w-full text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight px-2 bg-gradient-to-r from-[#a78bfa] via-[#8ab4ff] to-[#60a5fa] bg-clip-text text-transparent">
            Beat brainrot. Build focus with deep work sessions.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl px-4 max-w-2xl mx-auto">
            FocusDot makes focus fun — track your progress with streaks, scores, and a visual heatmap.
          </p>

          {/* Rating Row (no user count) */}
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span className="text-white ml-2">4.8/5</span>
          </div>

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
                  className="bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] text-white text-sm font-medium px-6 py-3 sm:py-2 rounded-full transition w-full sm:w-auto"
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
                className="bg-gradient-to-r from-[#6d5cf6] to-[#a78bfa] hover:from-[#5b4cf0] hover:to-[#947cf7] text-white text-base md:text-lg font-semibold px-7 md:px-8 py-3 md:py-3.5 rounded-full transition w-full sm:w-auto shadow-xl shadow-purple-800/40"
              >
                Boost your productivity for free ✨
              </button>
            )}
          </div>

          {/* Plan note */}
          <p className="text-gray-400 text-sm pt-1">Free Forever. Upgrade anytime.</p>

          {/* Carousel */}
          <div className="relative mt-6 sm:mt-8">
            <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-[#2b2b2b] bg-[#0c0c0f]/80 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] overflow-hidden">
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {slides.map((src, idx) => (
                    <div key={idx} className="min-w-full h-full flex items-center justify-center bg-gradient-to-b from-black via-[#0b0b10] to-[#1a1525]">
                      <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Dots */}
              <div className="flex items-center justify-center gap-2 py-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${activeSlide === idx ? 'bg-white w-6' : 'bg-gray-500'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Section: Brainrot vs FocusDot */}
          <div className="mt-16 md:mt-40 space-y-6">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight px-2 bg-gradient-to-r from-[#a78bfa] via-[#8ab4ff] to-[#60a5fa] bg-clip-text text-transparent text-center">
              Brainrot kills productivity. FocusDot fixes it.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Left - Brainrot */}
              <div className="rounded-3xl border border-[#f29aa3]/40 bg-[#2a1518]/40 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#ffb3ba]">Living with Brainrot</h3>
                  <span className="text-[#ff7a87] text-lg">❌</span>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li>• Mindless scrolling for hours</li>
                  <li>• Constant dopamine hits, no deep work</li>
                  <li>• Start 10 things, finish none</li>
                  <li>• Feel guilty at the end of the day</li>
                  <li>• Lose track of time and energy</li>
                </ul>
              </div>

              {/* Right - FocusDot */}
              <div className="rounded-3xl border border-[#8ff0b5]/40 bg-[#10231a]/40 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#9af0be]">Focusing with FocusDot</h3>
                  <span className="text-[#89f0b2] text-lg">✅</span>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li>• Structured deep work sessions</li>
                  <li>• Build streaks and see your progress</li>
                  <li>• Focus Score shows your growth</li>
                  <li>• Visual heatmap makes consistency fun</li>
                  <li>• End the day proud of real progress</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Post-comparison CTA */}
          <div className="mt-10 md:mt-14 flex justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-[#6d5cf6] to-[#a78bfa] hover:from-[#5b4cf0] hover:to-[#947cf7] text-white text-base md:text-lg font-semibold px-7 md:px-8 py-3 md:py-3.5 rounded-full transition shadow-xl shadow-purple-800/40"
            >
              Start your first focus session for free
            </button>
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-40 sm:h-44 md:h-48"></div>

      {/* Main Value Proposition Section */}
      <section id="demo" className="w-full flex flex-col items-center justify-center bg-[#151515] px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-center mb-4 sm:mb-6 px-4 bg-gradient-to-r from-[#a78bfa] via-[#8ab4ff] to-[#60a5fa] bg-clip-text text-transparent">
          Find out your Focus Score in 30 seconds
        </h2>
        <p className="text-gray-400 text-base sm:text-lg text-center mb-6 sm:mb-8 max-w-2xl px-4">
          Answer a few quick questions to see your Focus Score. Get a personalized suggestion to improve your deep work sessions.
        </p>
        <div className="mb-8">
          <button
            onClick={() => router.push('/get-focusscore')}
            className="bg-gradient-to-r from-[#6d5cf6] to-[#a78bfa] hover:from-[#5b4cf0] hover:to-[#947cf7] text-white text-sm sm:text-base font-semibold px-6 sm:px-7 py-2.5 sm:py-3 rounded-full transition shadow-xl shadow-purple-800/40"
          >
            Get Focus Score for free
          </button>
        </div>
        <div className="w-full max-w-4xl flex justify-center px-4">
          <div className="w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700">
            <img
              src="/focuscorecal.jpg"
              alt="Focus Score Calculator Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>


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
             Build momentum
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto md:mx-0">
              Your year of focus, visualized
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
            Set a goal and track your growth 
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

      {/* Features Section Part 4 - Focus Score */}
      <section className="w-full flex justify-center bg-[#151515] px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center md:items-start gap-8 sm:gap-12">
          
          {/* Left: Focus Score Image */}
          <div className="flex-1 max-w-2xl sm:max-w-4xl md:max-w-6xl">
            <img
              src="/focusscore.jpg"
              alt="Focus Score Analytics"
              className="rounded-2xl sm:rounded-3xl shadow-xl border-2 border-gray-700 w-full"
            />
          </div>

          {/* Right: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-snug">
              Focus Score
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto md:mx-0">
              Focus Score shows your progress as you build stronger attention skills through longer focus sessions and consistent practice.
            </p>
          </div>
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>


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
                Basic statistics
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Up to 1 focus category
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
                if (!user) {
                  router.push('/login?redirect=/pricing')
                } else {
                  openCheckout(isYearly ? 'PRO_YEARLY' : 'PRO_MONTHLY', user.email)
                }
              }}
              disabled={isPaddleLoading}
              className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black active:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaddleLoading ? 'Loading...' : 'Get Pro'}
            </button>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full flex justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="max-w-4xl w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">Is FocusDot free?</h3>
              <p className="text-gray-400">Yes. You can start for free and upgrade anytime for advanced insights.</p>
            </div>
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">What makes it different from a timer?</h3>
              <p className="text-gray-400">Visual progress with streaks, scores, and a yearly heatmap keeps you motivated.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
