import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/backend/request';
import { villageService } from '@/services/backend/village.service';

export const runtime = 'nodejs';

export async function GET() {
  const items = await villageService.listFeaturedVillages();
  return NextResponse.json({ items });
}

export const POST = withAuth(async (request, context, userId) => {
  try {
    const body = await request.json();
    const { name, description, tags } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const community = await villageService.createCommunity(userId, { name, description, tags });

    return NextResponse.json(community, { status: 201 });
  } catch (error) {
    console.error('Error creating village:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});