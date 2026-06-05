import { getAuthSessionByToken, sessionCookieName } from './session';
import { NextResponse } from 'next/server';

export const getRequestUserId = async (request: Request): Promise<string | null> => {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${sessionCookieName}=`))
    ?.split('=')[1];

  const session = await getAuthSessionByToken(token ? decodeURIComponent(token) : undefined);
  return session?.userId ?? null;
};

type ApiHandlerContext = { params: Record<string, string> };
type AuthenticatedApiHandler = (request: Request, context: ApiHandlerContext, userId: string) => Promise<NextResponse> | NextResponse;

export const withAuth = (handler: AuthenticatedApiHandler) => {
  return async (request: Request, context: ApiHandlerContext) => {
    const userId = await getRequestUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, context, userId);
  };
};