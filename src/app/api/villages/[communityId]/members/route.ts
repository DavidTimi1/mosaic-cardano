import { NextResponse } from 'next/server';
import { villageService } from '@/services/backend/village.service';
import { withAuth } from '@/lib/backend/request';

export const GET = withAuth(async (req, { params }) => {
  try {
    const communityId = params.communityId;

    const details = await villageService.getCommunityByIdOrSlug(communityId);
    if (!details) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    const members = await villageService.listCommunityMembers(details.id);

    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
