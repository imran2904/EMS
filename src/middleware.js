import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if user is trying to access dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // In middleware, we can't access localStorage directly
    // So we'll handle auth check in the component level
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};