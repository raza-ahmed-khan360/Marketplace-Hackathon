import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  const path = request.nextUrl.pathname;

  // If user is not logged in and trying to access protected routes
  if (!user && (path.startsWith('/admin') || path.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If user is logged in but trying to access admin routes without admin role
  if (user && path.startsWith('/admin')) {
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}; 