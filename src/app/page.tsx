'use client'

import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/lib/auth'
export default function Home() {
   const router = useRouter()
  return (
    <>
      {/* First Section */}
      <section className="w-full min-h-screen text-white flex flex-col justify-center items-center px-4">
  <div className="max-w-4xl w-full text-center space-y-6">
    <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
      Master Deep Work
    </h1>
    <p className="text-gray-400 text-lg sm:text-xl">
      FocusDot helps you track your deep work sessions, avoid distractions, and reach flow state consistently.
    </p>

    <div className="flex justify-center items-center gap-4 pt-6">
      <button
  onClick={() => {
    console.log('Try Now clicked')
    router.push('/login')
  }}
  className="bg-white text-black text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-200 transition"
>
  Try Now
</button>

      
    </div>
  </div>
</section>


      {/* Second Section */}
      <section id="demo" className="min-h-screen w-full flex flex-col items-center justify-center bg-[#151515] px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-4">
          Focus, log, and grow with every session.
        </h2>
        <p className="text-lg text-gray-400 text-center mb-10 max-w-2xl">
          App helps you stay focused and productive with a simple interface to track your time — whether you're working, studying, or just getting things done.
        </p>
        <div className="w-full max-w-3xl flex justify-center">
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/E5ONTXHS2mM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full flex justify-center px-6 py-40 bg-[#151515]">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-12">
          
          {/* Left: Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-snug">
              🎯 Minimal Focus Timer
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Start deep work with preset timers (25m, 45m, 1h, 2h) or custom durations.
              Choose from calming themes like flip clock or blank screen to block distractions.

              <br />
              <br />
              FocusSessions is designed to help you stay focused and productive, with a simple and intuitive interface that lets you track your time effortlessly.
              Whether you're working on a project, studying for an exam, or just trying to get things done.
            </p>
          </div>

          {/* Right: Chat Image */}
          <div className="flex-1 max-w-xl">
            <img
              src="/f3d27dee-5f39-42f3-8491-8c564f3c5cb6.png"
              alt="Conversational Flow Chat"
              className="rounded-3xl shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section Part 2 */}
      <section className="w-full flex justify-center bg-[#151515] px-6 py-80">
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center md:items-start gap-12">
          
          {/* Left: Chat Image */}
          <div className="flex-1 max-w-xl">
            <img
              src="/97840c68-6ee8-428a-9295-de211926179d.png"
              alt="Follow-up Chat"
              className="rounded-3xl shadow-xl w-full"
            />
          </div>

          {/* Right: Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-snug">
              Daily Grid View
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              See your focus streak grow visually. The more you focus, the darker the grid. A habit built one dot at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section Part 3 */}
      <section id="featuresp3" className="w-full flex justify-center px-6 py-40 bg-[#151515]">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-12">
          
          {/* Left: Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-snug">
              🧠 Log Your Sessions
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              After each session, reflect on what you achieved.
            </p>
          </div>

          {/* Right: Chat Image */}
          <div className="flex-1 max-w-xl">
            <img
              src="/f3d27dee-5f39-42f3-8491-8c564f3c5cb6.png"
              alt="Conversational Flow Chat"
              className="rounded-3xl shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full px-6 md:px-40 py-32 bg-[#151515]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            One click to <span className="relative inline-block">
              <span className="bg-yellow-400 text-black px-1 pt-1 pb-0 -mx-1">lifetime discipline</span>
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            This isn’t just a timer app. It helps to boost your productivity. You’ll get more done in a week than most do in a month!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-white mb-2">Monthly</h3>
            <p className="text-3xl font-bold text-white mb-1">$1.87/mth</p>
            <p className="text-sm text-gray-400 mb-6">Billed monthly.</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
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
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-8 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-2">Yearly</h3>
            <p className="text-3xl font-bold text-white mb-1">$9.9/mth</p>
            <p className="text-sm text-gray-400 mb-6">Billed annually.</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
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
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-white mb-2">Lifetime</h3>
            <p className="text-3xl font-bold text-white mb-1">$99/mth</p>
            <p className="text-sm text-gray-400 mb-6">Billed annually.</p>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
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
