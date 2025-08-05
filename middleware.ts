import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware disabled - let client-side handle all auth
  return NextResponse.next()
}

export const config = {
  matcher: [],
}