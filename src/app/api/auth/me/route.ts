import { NextResponse } from 'next/server';

import { authService } from '@/services/backend/auth.service';
import { AuthStateResponseSchema } from '@/types/api';
import { getRequestUserId } from '@/lib/backend/request';

export const runtime = 'nodejs';

const toAuthState = (user: Awaited<ReturnType<typeof authService.getUserById>>) => {
  if (!user) {
    return { isAuthenticated: false, user: null };
  }

  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.displayName,
      initials: user.displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 3),
      isOnboarded: user.isOnboarded,
      planType: user.planType,
      avatarUrl: null,
    },
  };
};

export async function GET(request: Request) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json(AuthStateResponseSchema.parse({ isAuthenticated: false, user: null }));
  }

  const user = await authService.getUserById(userId);
  if (!user) {
    return NextResponse.json(AuthStateResponseSchema.parse({ isAuthenticated: false, user: null }));
  }

  return NextResponse.json(AuthStateResponseSchema.parse(toAuthState(user)));
}