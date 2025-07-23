// middleware.js
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // 只拦截 /admin 页面
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // 验证 JWT
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      return NextResponse.next()
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
