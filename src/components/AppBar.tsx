'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function AppBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-10 py-6 flex justify-center items-center bg-[#151515]">

      <div className="flex items-center gap-12">
        {/* Logo */}
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-400 select-none">
          <Image src="/logo.png" alt="Logo" width={26} height={26} priority />
          <span className="text-white ml-2">FocusDot</span>
        </span>

        {/* Navbar Links */}
        <nav className="flex items-center gap-10">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
            }}
           className="text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition"

          >
            Demo
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
            }}
           className="text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition"

          >
            Features
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="text-[0.94rem] font-bold text-[#5F5F5F] hover:text-white transition"

          >
            Pricing
          </Link>
        </nav>
      </div>
    </header>
  )
}
