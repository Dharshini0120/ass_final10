// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

    if (!token && !isAuthPage) {
        // Redirect unauthenticated user to signin
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (token && isAuthPage) {
        // Redirect authenticated user away from signin/register
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// Protect these routes
export const config = {
    matcher: ['/dashboard', '/assessment/:path*'],
}
