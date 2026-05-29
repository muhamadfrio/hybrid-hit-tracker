import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/workout']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('payload-token')
  if (!token?.value) {
    const login = new URL('/login', request.url)
    login.searchParams.set('redirect', pathname)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/workout/:path*'],
}
