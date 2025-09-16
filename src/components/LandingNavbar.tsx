'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'

interface LandingNavbarProps {
  user: User | null
}

export default function LandingNavbar({ user }: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-10 py-2 sm:py-3 bg-[#151515]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-400 select-none">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" priority />
        </span>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link
            href="#pricing"
            className="text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition"
          >
            FAQ
          </Link>
          <Link
            href="#testimonials"
            className="text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition"
          >
            Testimonials
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              href="/app"
              className="bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] px-5 py-2 rounded-lg text-sm font-semibold text-white transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] px-5 py-2 rounded-lg text-sm font-semibold text-white transition"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-[#151515] border-t border-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <nav className="flex flex-col py-4">
          <Link
            href="#pricing"
            className="px-6 py-3 text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition hover:bg-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="px-6 py-3 text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition hover:bg-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="#testimonials"
            className="px-6 py-3 text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition hover:bg-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </Link>
          <div className="border-t border-gray-700 mt-2 pt-2">
            {user ? (
              <Link
                href="/app"
                className="block px-6 py-3 text-[0.94rem] font-bold text-gray-400 hover:text-white transition hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="block px-6 py-3 text-[0.94rem] font-bold text-gray-400 hover:text-white transition hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                className="block mx-6 mt-2 bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] px-5 py-3 rounded-lg text-sm font-semibold text-white transition text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
