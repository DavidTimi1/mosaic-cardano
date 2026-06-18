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

export const DELETE = withAuth(async (req, { params }, adminId) => {
  try {
    const communityId = params.communityId;

    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const memberIds = body.memberIds;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({ error: 'Invalid memberIds' }, { status: 400 });
    }

    await villageService.removeCommunityMembers(adminId, communityId, memberIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
