import { NextResponse } from 'next/server';

import { getRequestUserId } from '@/lib/backend/request';
import { villageService } from '@/services/backend/village.service';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: { communityId: string } }) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ isMember: false, role: null });
  }

  const membership = await villageService.checkCommunityMembership(userId, params.communityId);
  return NextResponse.json(membership);
}