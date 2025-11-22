import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = ['/dashboard', '/projects', '/assessments', '/settings', '/admin']
const adminRoutes = ['/admin']
const publicRoutes = ['/auth/login', '/auth/register', '/auth/error', '/', '/api/auth']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next()
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    
    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        console.log('Token:', token) // Debug log

        if (!token) {
            const url = new URL('/auth/login', request.url)
            url.searchParams.set('callbackUrl', encodeURIComponent(pathname))
            return NextResponse.redirect(url)
        }

        // Check admin access
        const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
        if (isAdminRoute && token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Middleware error:', error)
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}