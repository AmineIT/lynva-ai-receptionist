import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/auth/login'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            // Cookies are set via the response in App Router
          },
          remove(name: string, options) {
            // Cookies are removed via the response in App Router  
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const response = NextResponse.redirect(`${origin}/auth/login?message=verification-success`)
      
      // Set auth cookies
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        response.cookies.set('sb-access-token', sessionData.session.access_token, {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: sessionData.session.expires_in
        })
        response.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
      }
      
      return response
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?message=verification-error`)
}