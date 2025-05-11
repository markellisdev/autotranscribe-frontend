import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('authToken');
  const pathname = request.nextUrl.pathname;

  // Allow access to the login page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // In a real application, you would likely verify the token's validity here
  // For this simple example, we're just checking for its presence
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};