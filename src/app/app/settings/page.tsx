'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import AppNavbar from '@/components/AppNavbar'
import { useSubscriptionStatus } from '@/lib/subscriptionUtils'
import { useUser } from '@/lib/hooks/useAuth'
import { openCustomerPortal } from '@/lib/paddleCustomerPortal'
import { supabase } from '@/lib/supabaseClient'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { isPro, subscription } = useSubscriptionStatus()
  const { data: user } = useUser()
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'pro_monthly': return 'Pro Monthly'
      case 'pro_yearly': return 'Pro Yearly'
      default: return 'Free'
    }
  }

  const getPlanPrice = (planType: string) => {
    switch (planType) {
      case 'pro_monthly': return '$1.99/month'
      case 'pro_yearly': return '$9.99/year'
      default: return 'Free'
    }
  }


  const handleManagePayments = async () => {
    try {
      await openCustomerPortal({
        email: user?.email,
        returnUrl: `${window.location.origin}/app/settings`
      })
    } catch (error) {
      console.error('Error opening customer portal:', error)
      alert('Unable to open payment management. Please try again or contact support.')
    }
  }

  const handleChangePlan = () => {
    router.push('/pricing')
  }


  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  return (
    <>
      <Head>
        <title>Settings - Manage Your FocusDot Account | FocusDot</title>
        <meta name="description" content="Manage your FocusDot account settings, subscription, and billing. Update your plan, view subscription details, and access customer support." />
        <meta name="keywords" content="focus app settings, account management, subscription settings, billing management, focus tracker settings, productivity app account" />
        <link rel="canonical" href="https://focusdot.app/app/settings" />
        
        {/* Open Graph */}
        <meta property="og:title" content="FocusDot Settings - Manage Your Account" />
        <meta property="og:description" content="Manage your FocusDot account settings, subscription, and billing. Update your plan and view subscription details." />
        <meta property="og:url" content="https://focusdot.app/app/settings" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FocusDot Settings - Manage Your Account" />
        <meta name="twitter:description" content="Manage your FocusDot account settings, subscription, and billing." />
        <meta name="twitter:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "FocusDot Settings",
              "description": "Account management and settings page for FocusDot users",
              "url": "https://focusdot.app/app/settings",
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
      <div className="min-h-screen bg-[#13133c] text-white">
        <AppNavbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and subscription</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">My Account</h3>
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'general' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                General
              </button>
            </div>

            <div className="space-y-1 mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Subscription</h3>
              <button
                onClick={() => setActiveTab('plan-billing')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'plan-billing' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Plan & Billing
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">General Settings</h2>
                <div className="bg-[#1d1d4e] p-6 rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                      />
                    </div>
                    <div className="pt-4 border-t border-gray-600">
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'plan-billing' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">Plan & Billing</h2>
                    <p className="text-gray-400">Manage your plan and payments</p>
                  </div>
                  <div className="flex gap-3">
                    {!isPro ? (
                      <button
                        onClick={handleChangePlan}
                        className="px-6 py-3 border border-gray-300 text-white rounded-lg hover:bg-gray-800 transition flex items-center"
                      >
                        Upgrade to Pro
                        <span className="ml-2">↗</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleManagePayments}
                        className="px-6 py-3 border border-gray-300 text-white rounded-lg hover:bg-gray-800 transition flex items-center"
                      >
                        Manage Subscription
                        <span className="ml-2">↗</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Current Plan */}
                <div className="bg-[#1d1d4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Current plan</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-2xl font-bold">
                          {isPro ? getPlanPrice(subscription?.plan_type || 'free') : 'Free plan'}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isPro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isPro ? getPlanName(subscription?.plan_type || 'free') : 'Free'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                            isPro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            {isPro ? 'Active' : 'Free'}
                          </span>
                        </div>
                        {isPro && subscription?.current_period_end && (
                          <div className="text-sm text-gray-400 mt-1">
                            Renews at {formatDate(subscription.current_period_end)}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleChangePlan}
                      className="px-6 py-3 border border-gray-300 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      Change plan
                    </button>
                  </div>
                </div>

                {/* Support Message */}
                <div className="bg-[#1d1d4e] p-4 rounded-lg mt-6">
                  <div className="text-center">
                    <h3 className="text-base font-semibold mb-2 text-white">Need Help?</h3>
                    <p className="text-gray-400 mb-3 text-sm">
                      If you have any issues or concerns, please don&apos;t hesitate to reach out. We&apos;re here to help and will respond as soon as possible.
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-300 text-sm">Email us at:</span>
                      <a 
                        href="mailto:jushkinbek.co@gmail.com"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm"
                      >
                        jushkinbek.co@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#2A2A3A] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 transition-colors duration-200">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 mb-3 sm:mb-4">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">Logout</h3>
              
              {/* Message */}
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                Are you sure you want to logout? You&apos;ll need to sign in again to access your account.
              </p>
              
              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 border border-[#3A3A4A] text-gray-300 rounded-lg hover:bg-[#3A3A4A] transition-colors text-sm"
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
