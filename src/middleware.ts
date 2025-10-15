import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(process.env.BETTER_AUTH_SESSION_TOKEN!);

  if (!sessionCookie) {
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(new URL(`/sign-in?redirect=${redirectUrl}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/invite/:path*']
}