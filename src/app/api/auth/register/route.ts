import { NextResponse } from 'next/server';

import { authService } from '@/services/backend/auth.service';
import { authCookieOptions, createAuthSession, sessionCookieName } from '@/lib/backend/session';
import { AuthStateResponseSchema, RegisterWithPasswordRequestSchema } from '@/types/api';

export const runtime = 'nodejs';

const toAuthState = (user: Awaited<ReturnType<typeof authService.getUserById>>) => {
  if (!user) {
    return { isAuthenticated: false, user: null };
  }

  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      name: user.displayName,
      initials: user.displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 3),
      avatarUrl: null,
      isOnboarded: user.isOnboarded
    },
  };
};

export async function POST(request: Request) {
  try {
    const body = RegisterWithPasswordRequestSchema.parse(await request.json());
    const user = await authService.registerWithPassword(body);
    const token = await createAuthSession(user.id);

    const response = NextResponse.json(AuthStateResponseSchema.parse(toAuthState(user)));
    response.cookies.set(sessionCookieName, token, authCookieOptions);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}