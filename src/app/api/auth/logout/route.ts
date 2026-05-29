import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/login', request.url))
  res.cookies.set('payload-token', '', { maxAge: 0, path: '/' })
  return res
}
