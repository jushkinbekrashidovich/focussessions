// src/app/layout.tsx
import AppBar from '@/components/AppBar'
import './globals.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FocusSessions',
  description: 'Stay focused, one session at a time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppBar />
        <main className="bg-[#151515] p-6">{children}</main>
      </body>
    </html>
  )
}
