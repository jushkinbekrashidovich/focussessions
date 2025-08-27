'use client'

import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import LandingNavbar from './LandingNavbar'
import { useUser } from '@/lib/hooks'

export default function ConditionalAppBar() {
  const pathname = usePathname()
  const { data: user } = useUser()
  const userData = user || null

  // hide on login, app routes, and activity (since it has its own navbar)
  const hideAppBar = pathname === '/login' || pathname.startsWith('/app') || pathname === '/activity'

  if (hideAppBar) {
    return null
  }

  return <LandingNavbar user={userData} />
}
