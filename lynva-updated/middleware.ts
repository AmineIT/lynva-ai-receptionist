import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname.startsWith('/auth')

  // If user is not logged in and trying to access a protected route
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in but email is not verified and trying to access dashboard
  if (session && !session.user.email_confirmed_at && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login?message=email-not-verified', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and verified, redirect away from auth pages to dashboard
  if (session && session.user.email_confirmed_at && isAuthRoute && !pathname.includes('/callback')) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}