'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function AppBar() {
  return (
    <header className="w-full px-40 py-4 flex justify-between items-center bg-white">
      <div className="flex items-center gap-10">
        <span className="flex items-center gap-0.5 text-2xl font-bold text-gray-900 select-none mr-8">
          <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
          Focus<span className="text-indigo-600">sessions</span>
        </span>
        <nav className="flex items-center gap-8">
          <Link
    href="#"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    }}
    className="text-base text-gray-700 hover:text-black font-medium"
  >
    Demo
  </Link>
            <Link
    href="#"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }}
    className="text-base text-gray-700 hover:text-black font-medium"
  >
    Features
  </Link>
           <Link
    href="#"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }}
    className="text-base text-gray-700 hover:text-black font-medium"
  >
    Pricing
  </Link>
        </nav>
      </div>
      <Link
        href="#"
        className="bg-blue-600 text-white text-base px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition"
      >
        Log in
      </Link>
    </header>
  )
}
