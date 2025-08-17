'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function AppNavbar() {
  return (
    <header className="flex justify-between items-center px-10 py-4 border-b border-[#2a2a58] bg-[#13133c]">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <span className="flex items-center gap-2 text-lg font-semibold text-white">
          <Image src="/logo.svg" alt="Logo" width={106} height={106} priority />
          
        </span>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/app" className="hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/activity" className="hover:text-white transition">
            Personal Goals
          </Link>
        </nav>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <span className="text-green-400 text-sm">● 01:51:18</span>
        <Link href="/profile" className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-md text-sm font-medium text-white">
          Profile
        </Link>
      </div>
    </header>
  )
}
