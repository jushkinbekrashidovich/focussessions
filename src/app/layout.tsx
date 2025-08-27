// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  })

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <main className="bg-[#151515] transition-colors duration-200">
              {children}
            </main>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
