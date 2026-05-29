import { NextResponse } from 'next/server';

import { authCookieOptions, destroyAuthSessionByToken, sessionCookieName } from '@/lib/backend/session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${sessionCookieName}=`))
    ?.split('=')[1];

  await destroyAuthSessionByToken(token ? decodeURIComponent(token) : undefined);

  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookieName, '', { ...authCookieOptions, maxAge: 0 });
  return response;
}