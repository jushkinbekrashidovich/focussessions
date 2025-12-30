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
      case 'pro_monthly': return '$2.99/month'
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
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:w-80 space-y-6">
            {/* User Profile Section */}
            <div className="bg-[#1d1d4e] rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {user?.user_metadata?.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {isPro ? 'Pro Plan' : 'Free Plan'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  activeTab === 'general' 
                    ? 'bg-[#4A42E4] text-white' 
                    : 'text-gray-300 hover:bg-[#2a2a58]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>General</span>
              </button>

              <button
                onClick={() => setActiveTab('plan-billing')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  activeTab === 'plan-billing' 
                    ? 'bg-[#4A42E4] text-white' 
                    : 'text-gray-300 hover:bg-[#2a2a58]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Billing & Invoices</span>
              </button>
            </div>

            {/* Support Section */}
            <div className="pt-6 border-t border-gray-700">
              <button 
                onClick={() => setActiveTab('contact')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  activeTab === 'contact' 
                    ? 'bg-[#4A42E4] text-white' 
                    : 'text-gray-300 hover:bg-[#2a2a58]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Contact Us</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">General Settings</h1>
                  <p className="text-gray-400">Manage your account information and preferences</p>
                </div>

                <div className="bg-[#1d1d4e] rounded-xl p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-[#2a2a58] border border-gray-600 rounded-lg text-gray-300 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">Your email address cannot be changed</p>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-1">Account Actions</h3>
                          <p className="text-xs text-gray-500">Sign out of your account</p>
                        </div>
                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'plan-billing' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Billing & Invoices</h1>
                  <p className="text-gray-400">Manage your subscription and view billing history</p>
                </div>

                {/* Current Plan Summary */}
                <div className="bg-[#1d1d4e] rounded-xl p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-2">
                        {isPro ? getPlanName(subscription?.plan_type || 'free') : 'Free Plan'} Summary
                      </h2>
                      {isPro && subscription?.current_period_start && subscription?.current_period_end && (
                        <p className="text-sm text-gray-400">
                          {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={isPro ? handleManagePayments : handleChangePlan}
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-[#2a2a58] transition-colors text-sm font-medium flex items-center"
                    >
                      {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>

                  {/* Plan Details Table */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-gray-400">Item</div>
                      <div className="text-gray-400">Quantity</div>
                      <div className="text-gray-400">Cost</div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-white">
                          {isPro ? 'Pro Plan Access' : 'Free Plan Access'}
                        </div>
                        <div className="text-gray-300">
                          {isPro ? 'Unlimited' : 'Limited'}
                        </div>
                        <div className="text-gray-300">
                          {isPro ? getPlanPrice(subscription?.plan_type || 'free') : 'Free'}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                        <div className="text-white">Total</div>
                        <div className="text-gray-300">-</div>
                        <div className="text-white">
                          {isPro ? getPlanPrice(subscription?.plan_type || 'free') : 'Free'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isPro && subscription?.current_period_end && (
                    <div className="mt-4 text-xs text-gray-500">
                      * Your plan renews automatically on {formatDate(subscription.current_period_end)}
                    </div>
                  )}
                </div>

                {/* Invoices Section */}
                <div className="bg-[#1d1d4e] rounded-xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-white">Invoices</h2>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-400">Period:</label>
                      <select className="bg-[#2a2a58] border border-gray-600 text-white text-sm px-3 py-1.5 rounded">
                        <option>Current Period</option>
                        <option>Previous Period</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <div className="text-3xl font-bold text-white mb-2">
                      {isPro ? getPlanPrice(subscription?.plan_type || 'free') : '$0.00'}
                    </div>
                    <p className="text-sm text-gray-400 mb-6">
                      {isPro ? 'Current Period Total' : 'No charges for free plan'}
                    </p>
                    
                    {!isPro && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-400">
                          <div>Type</div>
                          <div>Cost</div>
                          <div>Qty</div>
                          <div>Total</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-gray-300">Subtotal:</div>
                          <div className="text-gray-300">-</div>
                          <div className="text-gray-300">-</div>
                          <div className="text-gray-300">$0.00</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-4">
                          No invoices found for current period
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Contact Us</h1>
                  <p className="text-gray-400">Get help and support for your FocusDot account</p>
                </div>

                {/* Contact Information */}
                <div className="bg-[#1d1d4e] rounded-xl p-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-4">Get Support</h2>
                      <p className="text-gray-300 mb-6">
                        If you have any issues, questions, or feedback about FocusDot, we&apos;re here to help. 
                        Our support team typically responds within 24 hours.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-[#2a2a58] rounded-lg">
                        <div className="w-10 h-10 bg-[#4A42E4] rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">Email Support</h3>
                          <p className="text-sm text-gray-400">Send us an email for assistance</p>
                          <a 
                            href="mailto:jushkinbek.co@gmail.com"
                            className="text-[#4A42E4] hover:text-[#3b35c6] font-medium text-sm transition-colors"
                          >
                            jushkinbek.co@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-[#2a2a58] rounded-lg">
                        <div className="w-10 h-10 bg-[#4A42E4] rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">Response Time</h3>
                          <p className="text-sm text-gray-400">We typically respond within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Common Issues */}
                <div className="bg-[#1d1d4e] rounded-xl p-8">
                  <h2 className="text-lg font-semibold text-white mb-4">Common Issues</h2>
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#4A42E4] pl-4">
                      <h3 className="text-sm font-medium text-white mb-1">Timer not working</h3>
                      <p className="text-sm text-gray-400">Make sure you have created a goal before starting the timer</p>
                    </div>
                    <div className="border-l-4 border-[#4A42E4] pl-4">
                      <h3 className="text-sm font-medium text-white mb-1">Subscription issues</h3>
                      <p className="text-sm text-gray-400">Check your billing information in the Billing & Invoices section</p>
                    </div>
                    <div className="border-l-4 border-[#4A42E4] pl-4">
                      <h3 className="text-sm font-medium text-white mb-1">Data not syncing</h3>
                      <p className="text-sm text-gray-400">Try refreshing the page or logging out and back in</p>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-[#1d1d4e] rounded-xl p-8">
                  <h2 className="text-lg font-semibold text-white mb-4">Send Feedback</h2>
                  <p className="text-gray-300 mb-6">
                    We value your feedback! Whether you have suggestions for new features, 
                    found a bug, or just want to share your experience, we&apos;d love to hear from you.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="mailto:jushkinbek.co@gmail.com?subject=FocusDot Feedback"
                      className="px-6 py-3 bg-[#4A42E4] hover:bg-[#3b35c6] active:bg-[#2d1b69] text-white rounded-lg transition-colors text-sm font-medium flex items-center"
                    >
                      Send Feedback
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
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
