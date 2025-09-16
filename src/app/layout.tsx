// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })



export const metadata = {
  title: {
    default: 'FocusDot - Build Unbreakable Concentration Habits',
    template: '%s | FocusDot'
  },
  description: 'The visual focus tracker built for anyone serious about building unbreakable deep work habits. Track your progress, see your streaks, and stay motivated every single day.',
  keywords: [
    'focus app',
    'concentration tracker',
    'deep work',
    'productivity app',
    'focus habits',
    'pomodoro timer',
    'focus streaks',
    'study timer',
    'work focus',
    'concentration habits',
    'focus tracker',
    'productivity tracker',
    'focus sessions',
    'deep work tracker',
    'focus visualization',
    'time management',
    'study habits',
    'work productivity',
    'focus techniques',
    'concentration training',
    'mindfulness timer',
    'study focus',
    'work sessions',
    'productivity tools',
    'focus management'
  ],
  authors: [{ name: 'FocusDot Team' }],
  creator: 'FocusDot',
  publisher: 'FocusDot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://focusdot.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://focusdot.app',
    title: 'FocusDot - Build Unbreakable Concentration Habits',
    description: 'The visual focus tracker built for anyone serious about building unbreakable deep work habits. Track your progress, see your streaks, and stay motivated every single day.',
    siteName: 'FocusDot',
    images: [
      {
        url: '/dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'FocusDot Dashboard - Visual Focus Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusDot - Build Unbreakable Concentration Habits',
    description: 'The visual focus tracker built for anyone serious about building unbreakable deep work habits.',
    images: ['/dashboard.jpg'],
    creator: '@focusdot',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
    ],
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C91LX4XSZ6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C91LX4XSZ6');
            `,
          }}
        />
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=3" />
        <link rel="manifest" href="/manifest.json" />
      </head>
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
