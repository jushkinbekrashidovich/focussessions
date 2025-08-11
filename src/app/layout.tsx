// src/app/layout.tsx
import ConditionalAppBar from '@/components/ConditionalAppBar'
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
        <ConditionalAppBar />
        <main className="bg-[#151515] ">{children}</main>
      </body>
    </html>
  )
}
