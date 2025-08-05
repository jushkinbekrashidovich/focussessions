'use client'

import { usePathname } from 'next/navigation'
import AppBar from './AppBar'

export default function ConditionalAppBar() {
  const pathname = usePathname()

  // hide on both /login and /app
  const hideAppBar = pathname === '/login' || pathname.startsWith('/app')

  if (hideAppBar) {
    return null
  }

  return <AppBar />
}
