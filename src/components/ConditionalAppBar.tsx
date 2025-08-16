'use client'

import { usePathname } from 'next/navigation'
import LandingNavbar from './LandingNavbar'

export default function ConditionalAppBar() {
  const pathname = usePathname()

  // hide on login, app routes, and activity (since it has its own navbar)
  const hideAppBar = pathname === '/login' || pathname.startsWith('/app') || pathname === '/activity'

  if (hideAppBar) {
    return null
  }

  return <LandingNavbar />
}
