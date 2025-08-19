import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Only run middleware on routes that need authentication
    const protectedRoutes = ['/app', '/profile', '/activity']
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )
    
    // If not a protected route, just continue without middleware
    if (!isProtectedRoute) {
      return NextResponse.next()
    }

    const supabaseResponse = NextResponse.next({
      request,
    })

    // Check if environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables in middleware')
      // Redirect to login if we can't authenticate
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, ...options }) => {
              request.cookies.set({
                name,
                value,
                ...options,
              })
              supabaseResponse.cookies.set({
                name,
                value,
                ...options,
              })
            })
          },
        },
      }
    )

    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Middleware auth error:', error)
      // If there's an auth error, redirect to login
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If no session and trying to access protected routes, redirect to login
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If session exists and trying to access login, redirect to app
    if (session && request.nextUrl.pathname === '/login') {
      const redirectUrl = new URL('/app', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // If middleware fails, redirect to login
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match only the routes that need middleware:
     * - /app/* (protected routes)
     * - /profile/* (protected routes) 
     * - /activity/* (protected routes)
     * - /login (for redirect logic)
     */
    '/app/:path*',
    '/profile/:path*', 
    '/activity/:path*',
    '/login'
  ],
}
