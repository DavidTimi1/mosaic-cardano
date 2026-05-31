import { getAuthSessionByToken, sessionCookieName } from './session';

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