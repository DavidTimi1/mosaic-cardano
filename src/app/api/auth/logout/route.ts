import { NextResponse } from 'next/server';
import { invalidateRequestSession } from '@/lib/backend/session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  await invalidateRequestSession(request, response);
  return response;
}