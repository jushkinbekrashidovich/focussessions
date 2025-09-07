'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppNavbar from '@/components/AppNavbar'
import { useSubscriptionStatus } from '@/lib/subscriptionUtils'
import { useUser } from '@/lib/hooks/useAuth'
import { useSessions } from '@/lib/hooks/useSessions'
import { useSkills } from '@/lib/hooks/useSkills'
import { openCustomerPortal, cancelSubscription } from '@/lib/paddleCustomerPortal'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { isPro, isSubscriptionLoading, subscription } = useSubscriptionStatus()
  const { data: user } = useUser()
  const { data: sessions = [] } = useSessions()
  const { data: skills = [] } = useSkills()
  const router = useRouter()

  // Calculate usage statistics
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlySessions = sessions.filter(session => {
    const sessionDate = new Date(session.created_at)
    return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear
  })
  
  const monthlyHours = monthlySessions.reduce((total, session) => total + (session.duration_min || 0), 0) / 60
  const totalSessions = sessions.length
  const totalSkills = skills.length

  // Free plan limits
  const freePlanLimits = {
    monthlyHours: 10,
    totalSessions: 50,
    skills: 3
  }

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
      case 'lifetime': return 'Lifetime'
      default: return 'Free'
    }
  }

  const getPlanPrice = (planType: string) => {
    switch (planType) {
      case 'pro_monthly': return '$1.90/month'
      case 'pro_yearly': return '$20.00/year'
      case 'lifetime': return '$44.00 (one-time)'
      default: return 'Free'
    }
  }

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your current billing period.')) {
      try {
        if (subscription?.paddle_subscription_id) {
          await cancelSubscription(subscription.paddle_subscription_id)
          alert('Your subscription has been canceled. You will retain access to Pro features until the end of your current billing period.')
          // Refresh the page to update subscription status
          window.location.reload()
        } else {
          alert('Unable to find subscription details. Please contact support.')
        }
      } catch (error) {
        console.error('Error canceling subscription:', error)
        alert('Failed to cancel subscription. Please try again or contact support.')
      }
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

  return (
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
                <span className="flex items-center">
                  <span className="mr-3">😊</span>
                  General
                </span>
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'password' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-3">🔒</span>
                  Password
                </span>
              </button>
            </div>

            <div className="space-y-1 mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Organization</h3>
              <button
                onClick={() => setActiveTab('plan-billing')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'plan-billing' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-3">📄</span>
                  Plan & Billing
                </span>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Name</label>
                      <input
                        type="text"
                        value={user?.user_metadata?.full_name || ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Password Settings</h2>
                <div className="bg-[#1d1d4e] p-6 rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition">
                      Update Password
                    </button>
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
                    {isPro && (
                      <>
                        <button
                          onClick={handleCancelSubscription}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                        >
                          Cancel subscription
                        </button>
                        <button
                          onClick={handleManagePayments}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center"
                        >
                          Manage payments
                          <span className="ml-2">↗</span>
                        </button>
                      </>
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
                      className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition"
                    >
                      Change plan
                    </button>
                  </div>
                </div>

                {/* Usage */}
                <div className="bg-[#1d1d4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Usage</h3>
                  <p className="text-gray-400 text-sm mb-6">Your usage is renewed every month</p>
                  
                  <div className="space-y-6">
                    {/* Monthly Focus Hours */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600">⏱️</span>
                        </div>
                        <div>
                          <div className="font-medium">Focus Hours</div>
                          <div className="text-sm text-gray-400">
                            {monthlyHours.toFixed(1)} of {isPro ? 'Unlimited' : freePlanLimits.monthlyHours}
                          </div>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: isPro ? '100%' : `${Math.min((monthlyHours / freePlanLimits.monthlyHours) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Total Sessions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600">📊</span>
                        </div>
                        <div>
                          <div className="font-medium">Focus Sessions</div>
                          <div className="text-sm text-gray-400">
                            {totalSessions} of {isPro ? 'Unlimited' : freePlanLimits.totalSessions}
                          </div>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: isPro ? '100%' : `${Math.min((totalSessions / freePlanLimits.totalSessions) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Skills/Categories */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600">🎯</span>
                        </div>
                        <div>
                          <div className="font-medium">Focus Categories</div>
                          <div className="text-sm text-gray-400">
                            {totalSkills} of {isPro ? 'Unlimited' : freePlanLimits.skills}
                          </div>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: isPro ? '100%' : `${Math.min((totalSkills / freePlanLimits.skills) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
