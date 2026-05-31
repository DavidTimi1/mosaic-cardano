import { NextResponse } from 'next/server';

import { getRequestUserId } from '@/lib/backend/request';
import { homeService } from '@/services/backend/home.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const items = await homeService.listActiveProjects(userId);
  return NextResponse.json({ items });
}