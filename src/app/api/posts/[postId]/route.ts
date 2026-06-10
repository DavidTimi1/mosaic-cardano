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
    
    const thread = await postService.getPostThread(postId, userId);

    if (!thread || thread.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ items: thread });
  } catch (error) {
    console.error('Error fetching post thread:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
