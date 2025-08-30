'use client'

import LandingNavbar from '@/components/LandingNavbar'
import Footer from '@/components/Footer'
import { useUser } from '@/lib/hooks'

export default function RefundPage() {
  const { data: user } = useUser()
  const userData = user || null

  return (
    <>
      <LandingNavbar user={userData} />
      <div className="min-h-screen bg-[#151515] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">1. General Refund Policy</h2>
              <p>FocusSessions offers subscription-based services with automatic recurring billing. All subscription fees are non-refundable except as required by law or as outlined in this policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">2. Subscription Cancellation</h2>
              <p>You may cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to the service until the end of your current billing period. No refunds will be issued for unused portions of the billing period.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">3. Service Issues</h2>
              <p>If you experience technical issues that prevent you from using our service, please contact our support team immediately. We will work to resolve the issue promptly. If we are unable to resolve the issue within a reasonable time, we may offer a partial refund or credit.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">4. Billing Errors</h2>
              <p>If you believe you have been charged incorrectly, please contact us within 30 days of the charge. We will investigate and, if an error is found, we will issue a refund or credit as appropriate.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">5. Free Trial Period</h2>
              <p>If you signed up for a free trial, you will not be charged until the trial period ends. You may cancel at any time during the trial period without being charged.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">6. Annual Subscriptions</h2>
              <p>For annual subscriptions, refunds are not provided for partial months. If you cancel an annual subscription, you will continue to have access until the end of your billing period.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">7. Special Circumstances</h2>
              <p>We may consider refunds in special circumstances, such as extended service outages or significant changes to our service that materially affect your ability to use the service. These decisions are made on a case-by-case basis.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">8. How to Request a Refund</h2>
              <p>To request a refund, please contact our support team at support@focusdot.app with your account details and the reason for your request. We will review your request and respond within 5 business days.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">9. Refund Processing</h2>
              <p>If a refund is approved, it will be processed within 5-10 business days. The refund will be issued to the original payment method used for the purchase.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact Information</h2>
              <p>For questions about this refund policy or to request a refund, please contact us at support@focusdot.app</p>
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
