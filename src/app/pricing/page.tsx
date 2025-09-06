import AppNavbar from '@/components/AppNavbar'
import PricingContent from '@/components/PricingContent'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#13133c] text-white flex flex-col">
      <AppNavbar />
      <PricingContent />
    </div>
  )
}
