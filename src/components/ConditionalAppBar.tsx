'use client'

import { usePathname } from 'next/navigation'
import AppBar from './AppBar'

export default function ConditionalAppBar() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return null
  }

  return <AppBar />
} 