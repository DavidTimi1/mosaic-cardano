import { NextResponse } from 'next/server';
import { villageService } from '@/services/backend/village.service';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ communityId: string }> }
) {
  try {
    const { communityId } = await params;
    const members = await villageService.listCommunityMembers(communityId, 50);
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching village members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
