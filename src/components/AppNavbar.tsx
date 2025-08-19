'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function AppNavbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 border-b border-gray-200 dark:border-[#2a2a58] bg-white dark:bg-[#13133c] transition-colors duration-200">
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
        {/* Logo */}
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <Image src="/logo.svg" alt="Logo" width={106} height={106} priority />
          
        </span>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/app" className="hover:text-gray-900 dark:hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/activity" className="hover:text-gray-900 dark:hover:text-white transition">
            Personal Goals
          </Link>
        </nav>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Desktop Profile Link */}
        <Link href="/profile" className="hidden md:block bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition px-4 py-2 rounded-md text-sm font-medium text-white">
          Profile
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-[#13133c] shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="space-y-4">
              <Link
                href="/app"
                className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a58] rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/activity"
                className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a58] rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Personal Goals
              </Link>
              <Link
                href="/profile"
                className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a58] rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
