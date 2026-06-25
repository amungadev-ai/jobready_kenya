import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'jobr-dev-secret-change-in-production',
  })

  const { pathname } = req.nextUrl

  // Skip middleware for /api/auth/* routes (handled by matcher, but double-check)
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Protected routes require auth
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const userRole = token.role as string | undefined

  // Admin routes require ADMIN role
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Employer dashboard routes require EMPLOYER or ADMIN role
  if (
    pathname.startsWith('/dashboard/employer') &&
    userRole !== 'EMPLOYER' &&
    userRole !== 'ADMIN'
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}