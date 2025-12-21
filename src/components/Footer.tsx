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
              <Image src="/new_logo.png" alt="FocusDot" width={40} height={40} />
              <span className="text-xl font-bold text-white">FocusDot</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A modern productivity platform that helps you build focus habits through gamified time-tracking. 
              Save your time and increase your efficiency with deep work sessions.
            </p>
            <div className="flex space-x-3">
              {/* Social Media Icons */}
              <a href="https://www.linkedin.com/company/focusdot/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition">
                <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} />
              </a>
              <a href="https://x.com/focusdot_app?t=GdrKmoH2AfseMXzNvWHjMw&s=09" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition">
                <Image src="/x.svg" alt="X (Twitter)" width={16} height={16} />
              </a>
              <a href="https://www.instagram.com/focusdot.app?igsh=eGh2ejAxYm9qeWVw" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition">
                <Image src="/instagram.svg" alt="Instagram" width={16} height={16} />
              </a>
              <a href="https://www.youtube.com/@focusdot_app" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition">
                <Image src="/globe.svg" alt="YouTube" width={16} height={16} />
              </a>
              <a href="https://tiktok.com/@focusdot.app" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition" title="TikTok">
                <Image src="/tiktok.svg" alt="TikTok" width={16} height={16} />
              </a>
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
              <Link href="mailto:jushkinbek.co@gmail.com" className="block text-gray-400 hover:text-white transition text-sm">
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
