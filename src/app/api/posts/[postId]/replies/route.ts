import { NextResponse } from 'next/server';
import { getRequestUserId } from '@/lib/backend/request';
import { postService } from '@/services/backend/post.service';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const userId = await getRequestUserId(request);
    
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 10;
    const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : 0;

    const posts = await postService.getPostReplies(postId, userId, limit, offset);

    return NextResponse.json({ items: posts, nextOffset: posts.length === limit ? offset + limit : null });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
