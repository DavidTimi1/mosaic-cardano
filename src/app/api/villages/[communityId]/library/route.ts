import { NextResponse } from 'next/server';
import { getRequestUserId } from '@/lib/backend/request';
import { postService } from '@/services/backend/post.service';
import { z } from 'zod';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  filter: z.enum(['Pieces', 'Publications', 'Projects', 'All']).default('All'),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ communityId: string }> }
) {
  try {
    const { communityId } = await params;
    const userId = await getRequestUserId(request);
    
    const { searchParams } = new URL(request.url);
    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
    
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    const { filter, limit, offset } = parseResult.data;

    const posts = await postService.listPosts(communityId, userId, limit, offset, filter === 'All' ? undefined : filter);

    return NextResponse.json({
      items: posts,
      nextOffset: posts.length === limit ? offset + limit : null,
    });
  } catch (error) {
    console.error('Error fetching library materials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
