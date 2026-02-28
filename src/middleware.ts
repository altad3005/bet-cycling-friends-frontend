import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/leagues', '/profile']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if this path requires authentication
    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

    if (!isProtected) {
        return NextResponse.next()
    }

    // Read the auth token from the cookie (dual-written on login)
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
        const indexUrl = new URL('/', request.url)
        indexUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(indexUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public files
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
}
