import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if authentication is enabled via environment variable
  const authEnabled = process.env.ENABLE_AUTH === 'true';

  // If auth is disabled, allow all requests through
  if (!authEnabled) {
    return NextResponse.next();
  }

  // Skip middleware for API routes, static files, and login page
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authCookie = request.cookies.get('site-auth');

  if (!authCookie || authCookie.value !== 'authenticated') {
    // Redirect to login page with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
