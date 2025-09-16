// components/LoginPage.jsx
'use client'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'

import { signInWithGoogle } from '@/lib/auth'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Head from 'next/head'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/app'
  
  return (
    <>
      <Head>
        <title>Sign In - FocusDot | Secure Login for Focus Tracking</title>
        <meta name="description" content="Sign in to FocusDot to access your focus tracking dashboard. Secure Google OAuth2 authentication for your productivity journey." />
        <meta name="keywords" content="focus app login, sign in focus tracker, productivity app login, deep work app access, focus timer login, study app sign in" />
        <link rel="canonical" href="https://focusdot.app/login" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Sign In to FocusDot - Focus Tracking App" />
        <meta property="og:description" content="Sign in to FocusDot to access your focus tracking dashboard. Secure Google OAuth2 authentication." />
        <meta property="og:url" content="https://focusdot.app/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sign In to FocusDot - Focus Tracking App" />
        <meta name="twitter:description" content="Sign in to FocusDot to access your focus tracking dashboard. Secure Google OAuth2 authentication." />
        <meta name="twitter:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "FocusDot Login",
              "description": "Secure login page for FocusDot focus tracking application",
              "url": "https://focusdot.app/login",
              "isPartOf": {
                "@type": "WebApplication",
                "name": "FocusDot",
                "url": "https://focusdot.app"
              },
              "author": {
                "@type": "Organization",
                "name": "FocusDot Team"
              }
            })
          }}
        />
      </Head>

      {/* Background */}
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0b0f]">
        {/* Card */}
        <div className="relative w-full max-w-md rounded-3xl border border-[#2a2f3a] bg-[#0e1117] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 sm:p-10 text-center">
          {/* Icon circle */}
          <div className="mx-auto -mt-14 mb-6 w-16 h-16 rounded-full bg-[#121622] border border-[#2a2f3a] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <svg className="w-7 h-7 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19l12-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 7l1 1M7 16l1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">Welcome back 👋</h1>
          <p className="text-gray-400 mb-8">Use your google account to login.</p>

          {/* Google only */}
          <button 
            onClick={() => {
              console.log('Google sign-in clicked')
              // Store the redirect URL in localStorage before signing in
              localStorage.setItem('redirectAfterLogin', redirectTo)
              signInWithGoogle()
            }}
            className="flex items-center justify-center w-full py-3 border border-[#2f3440] rounded-xl text-white bg-[#0b0e14] hover:bg-[#121723] transition shadow-inner"
          >
            <svg
              className="w-5 h-5 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8c0-17.8-1.5-35.6-4.7-52.8H249v99.7h135.7c-5.8 31.4-23.4 58-49.6 76l80 62.4c47-43.4 74-107.4 74-185.3zM249 492c66 0 121.3-21.7 161.7-58.7l-80-62.4c-22.2 15-50.6 23.9-81.7 23.9-62.8 0-116-42.5-135-99.7l-83.4 64.8C55.8 453.3 145.2 492 249 492zM114 303.1c-6.4-18.8-10-38.8-10-59.1s3.6-40.3 10-59.1l-83.4-64.8C11.7 153.7 0 199.3 0 244s11.7 90.3 30.6 123.9l83.4-64.8zM249 98.3c35.8 0 67.8 12.4 93.2 36.7l69.8-69.8C366.3 29 312 8 249 8 145.2 8 55.8 46.7 30.6 120.1l83.4 64.8c19-57.2 72.2-99.7 135-99.7z"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="text-gray-500 text-xs mt-6">Secure OAuth2 via Google</p>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}