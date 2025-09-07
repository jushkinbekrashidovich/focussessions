'use client'

import LandingNavbar from '@/components/LandingNavbar'
import Footer from '@/components/Footer'
import { useUser } from '@/lib/hooks'

export default function TermsPage() {
  const { data: user } = useUser()
  const userData = user || null

  return (
    <>
      <LandingNavbar user={userData} />
      <div className="min-h-screen bg-[#151515] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using FocusDot (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p>FocusDot is a productivity application that provides time-tracking, focus session management, and productivity analytics tools to help users build better work habits.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">4. Subscription and Billing</h2>
              <p>Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
              <p>You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service. You may not attempt to gain unauthorized access to any part of the Service.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">6. Privacy</h2>
              <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">8. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at jushkinbek.co@gmail.com</p>
            </div>

            <div className="pt-4 text-sm text-gray-400">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  )
}
