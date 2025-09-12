import AppNavbar from '@/components/AppNavbar'
import PricingContent from '@/components/PricingContent'
import Head from 'next/head'

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing - FocusDot Pro Plans | Focus Timer & Deep Work App</title>
        <meta name="description" content="Choose the perfect FocusDot plan for your productivity needs. Free tier available with Pro plans starting at $1.99/month. Advanced analytics, unlimited categories, and priority support." />
        <meta name="keywords" content="focus app pricing, productivity app cost, deep work timer price, focus tracker subscription, pomodoro timer plans, study app pricing, concentration app cost" />
        <link rel="canonical" href="https://focusdot.app/pricing" />
        
        {/* Open Graph */}
        <meta property="og:title" content="FocusDot Pricing - Pro Plans for Deep Work" />
        <meta property="og:description" content="Choose the perfect FocusDot plan for your productivity needs. Free tier available with Pro plans starting at $1.99/month." />
        <meta property="og:url" content="https://focusdot.app/pricing" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FocusDot Pricing - Pro Plans for Deep Work" />
        <meta name="twitter:description" content="Choose the perfect FocusDot plan for your productivity needs. Free tier available with Pro plans starting at $1.99/month." />
        <meta name="twitter:image" content="https://focusdot.app/dashboard.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "FocusDot Pro",
              "description": "Advanced focus tracking and deep work analytics",
              "url": "https://focusdot.app/pricing",
              "category": "Productivity Software",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Basic focus timer and progress tracking"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Monthly",
                  "price": "1.99",
                  "priceCurrency": "USD",
                  "description": "Advanced analytics and unlimited categories"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Yearly",
                  "price": "9.99",
                  "priceCurrency": "USD",
                  "description": "Advanced analytics and unlimited categories - 58% savings"
                }
              ],
              "brand": {
                "@type": "Brand",
                "name": "FocusDot"
              }
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
        <AppNavbar />
        <PricingContent />
      </div>
    </>
  )
}
