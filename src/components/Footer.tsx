'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#151515] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Brand Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="FocusDot" width={40} height={40} />
              <span className="text-xl font-bold text-white">FocusDot</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A modern productivity platform that helps you build focus habits through gamified time-tracking. 
              Save your time and increase your efficiency with deep work sessions.
            </p>
            <div className="flex space-x-3">
              {/* Social Media Icons - You can add these later */}
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">T</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">I</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">L</span>
              </div>
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition text-sm">
                Home
              </Link>
              <Link href="#features" className="block text-gray-400 hover:text-white transition text-sm">
                Features
              </Link>
              <Link href="#pricing" className="block text-gray-400 hover:text-white transition text-sm">
                Pricing
              </Link>
              <Link href="/app" className="block text-gray-400 hover:text-white transition text-sm">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Right Column - Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support & Legal</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-gray-400 hover:text-white transition text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition text-sm">
                Privacy Policy
              </Link>
              <Link href="/refund" className="block text-gray-400 hover:text-white transition text-sm">
                Refund Policy
              </Link>
              <Link href="mailto:support@focusdot.app" className="block text-gray-400 hover:text-white transition text-sm">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Partnership */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 FocusDot. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm">
              Built with ☕ for productivity
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
