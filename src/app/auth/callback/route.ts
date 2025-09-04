import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to login on error
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }
  }

  // URL to redirect to after sign in process completes
  // Check if there's a redirect parameter in the URL
  const redirectTo = requestUrl.searchParams.get('redirect') || '/app'
  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`)
} 