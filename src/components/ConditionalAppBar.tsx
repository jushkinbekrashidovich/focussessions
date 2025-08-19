'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import LandingNavbar from './LandingNavbar'

export default function ConditionalAppBar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  // hide on login, app routes, and activity (since it has its own navbar)
  const hideAppBar = pathname === '/login' || pathname.startsWith('/app') || pathname === '/activity'

  if (hideAppBar) {
    return null
  }

  return <LandingNavbar user={user} />
}
