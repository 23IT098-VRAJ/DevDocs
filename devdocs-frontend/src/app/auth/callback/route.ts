import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // The code will be handled by the Supabase client automatically
    // Just redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If no code, redirect to signin
  return NextResponse.redirect(new URL('/auth/signin', request.url));
}
