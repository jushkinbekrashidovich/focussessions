// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'

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
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <main className="bg-[#151515] transition-colors duration-200">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
