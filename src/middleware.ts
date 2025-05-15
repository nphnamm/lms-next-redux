import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authService } from '@/lib/services/authService';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no tokens are present, redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If access token is present, proceed
  if (accessToken) {
    return NextResponse.next();
  }

  // If only refresh token is present, try to refresh the access token
  if (refreshToken) {
    try {
      const refreshResponse = await authService.refreshToken();
      if (refreshResponse.data.accessToken) {
        const response = NextResponse.next();
        response.cookies.set('access_token', refreshResponse.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, // 1 day
        });
        return response;
      }
    } catch (error) {
      // If refresh fails, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
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