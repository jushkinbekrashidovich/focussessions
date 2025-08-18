'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

export default function AppNavbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex justify-between items-center px-10 py-4 border-b border-gray-200 dark:border-[#2a2a58] bg-white dark:bg-[#13133c] transition-colors duration-200">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <Image src="/logo.svg" alt="Logo" width={106} height={106} priority />
          
        </span>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
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
        <span className="text-green-600 dark:text-green-400 text-sm">● 01:51:18</span>
        
        {/* Theme Toggle Button
        <button 
          onClick={toggleTheme}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button> */}
        
        <Link href="/profile" className="bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition px-4 py-2 rounded-md text-sm font-medium text-white">
          Profile
        </Link>
      </div>
    </header>
  )
}
