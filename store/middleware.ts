import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'drip_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (but not /admin/login API)
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get(ADMIN_COOKIE)?.value;

    // Validate session token (must match the signed value)
    const expectedToken = process.env.ADMIN_SESSION_TOKEN || 'drip-admin-secret-2025';

    if (session !== expectedToken) {
      // Redirect to login page
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
