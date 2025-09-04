'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LandingNavbar from '@/components/LandingNavbar'
import { useUser } from '@/lib/hooks'
import Footer from '@/components/Footer'

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl overflow-hidden">
      <button
        className="w-full px-6 py-4 sm:px-8 sm:py-6 text-left flex justify-between items-center hover:bg-[#2a2a2a] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-white font-semibold text-base sm:text-lg pr-4">
          {question}
        </h3>
        <div className="flex-shrink-0">
          <span className={`text-white text-xl font-bold transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
            +
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-4 sm:px-8 sm:py-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const { data: user, isLoading } = useUser()
  const userData = user || null

  return (
    <>
      <LandingNavbar user={userData} />
      {/* Spacing between navbar and first section */}
      <div className="h-40 sm:h-44 md:h-48"></div>
      
      {/* First Section */}
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

      {/* Second Section */}
      <section id="demo" className="w-full flex flex-col items-center justify-center bg-[#151515] px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center mb-6 sm:mb-8 px-4">
          Track your focus streaks and build <span className="relative inline-block">
            <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">unbreakable concentration habits</span>
          </span>
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

      {/* FAQ Section */}
      <section id="faq" className="w-full px-4 sm:px-6 md:px-40 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 px-4">
            <span className="relative inline-block">
              <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Frequently Asked Questions</span>
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem 
            question="How is this different from other Pomodoro apps?"
            answer="FocusDot focuses on long-term habit building with visual progress tracking. Instead of just timing sessions, you see your entire focus journey and build streaks that motivate consistency."
          />
          <FAQItem 
            question="Can I track different types of work separately?"
            answer="Yes! Create unlimited categories (with Pro) to track work projects, study sessions, creative time, and more."
          />
        </div>
      </section>

      {/* Spacing between sections */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Who This Is For Section */}
      <section id="who-this-is-for" className="w-full px-4 sm:px-6 md:px-40 py-12 sm:py-16 md:py-20 bg-[#151515]">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 px-4">
            <span className="relative inline-block">
              <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Perfect For</span>
            </span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Anyone building deep focus skills</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                For complex work or study sessions that require sustained concentration and mental discipline.
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
            <span className="relative inline-block">
              <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">Build Better Focus Habits</span>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
            Build discipline, stay consistent, and track your progress visually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">FREE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Free</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$0</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">Forever free</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ Basic focus timer</li>
              <li>✔ Simple progress tracking</li>
              <li>✔ Basic statistics</li>
              <li>✔ Up to 3 focus categories</li>
              <li>✔ Community support</li>
            </ul>
            <button className="w-full border border-gray-600 text-gray-300 font-medium py-2 rounded-md hover:border-gray-500 hover:text-white transition cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Monthly Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Pro Monthly</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$1.9</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">per month</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ Everything in Free</li>
              <li>✔ Advanced analytics & insights</li>
              <li>✔ Unlimited focus categories</li>
              <li>✔ Custom focus goals</li>
              <li>✔ Priority support</li>
            </ul>
            <button className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition">
              Get Pro
            </button>
          </div>

          {/* Pro Yearly Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-md relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Pro Yearly</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$20</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">per year</p>
            <p className="text-xs text-green-400 mb-4 text-center">Save 12% vs monthly</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ Everything in Pro Monthly</li>
              <li>✔ Early access to new features</li>
              <li>✔ Advanced focus insights</li>
              <li>✔ Priority support</li>
            </ul>
            <button className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-gray-300 transition">
              Get Pro Yearly
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-4">
              <span className="inline-block bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">LIMITED</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">Lifetime</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">$44</p>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center">One-time payment</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-4 sm:mb-6">
              <li>✔ Everything in Pro Yearly</li>
              <li>✔ All future features included</li>
              <li>✔ Lifetime updates</li>
              <li>✔ Premium support</li>
              <li>✔ No recurring fees</li>
            </ul>
            <button className="w-full border border-white text-white font-medium py-2 rounded-md hover:bg-white hover:text-black transition">
              Get Lifetime
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
