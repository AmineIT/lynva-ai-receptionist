import { createServerSupabase } from './server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    const response = NextResponse.next({ request: { headers: request.headers } });

    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

    // Redirect unauthenticated users trying to access dashboard to login
    if (!user && isDashboardRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users trying to access auth pages to dashboard
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}
