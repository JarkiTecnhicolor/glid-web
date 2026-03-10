import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/cabinet']
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/reset-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  const token =
    request.cookies.get('glid_access_token')?.value ??
    request.headers.get('Authorization')?.replace('Bearer ', '')

  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/cabinet', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cabinet/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
  ],
}
