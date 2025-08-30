'use client'

import LandingNavbar from '@/components/LandingNavbar'
import Footer from '@/components/Footer'
import { useUser } from '@/lib/hooks'

export default function PrivacyPage() {
  const { data: user } = useUser()
  const userData = user || null

  return (
    <>
      <LandingNavbar user={userData} />
      <div className="min-h-screen bg-[#151515] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include your name, email address, and usage data related to your focus sessions and productivity activities.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">5. Cookies and Tracking</h2>
              <p>We use cookies and similar tracking technologies to enhance your experience on our website and to analyze how our services are used. You can control cookie settings through your browser preferences.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">6. Third-Party Services</h2>
              <p>We may use third-party services for analytics, payment processing, and other functions. These services have their own privacy policies, and we encourage you to review them.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">8. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request data portability. Contact us to exercise these rights.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">9. Children's Privacy</h2>
              <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@focusdot.app</p>
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
