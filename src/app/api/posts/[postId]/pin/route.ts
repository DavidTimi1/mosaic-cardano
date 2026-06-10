import { NextResponse } from 'next/server';
import { getRequestUserId } from '@/lib/backend/request';
import { postService } from '@/services/backend/post.service';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const userId = await getRequestUserId(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isPinned } = body;

    if (typeof isPinned !== 'boolean') {
      return NextResponse.json({ error: 'isPinned must be a boolean' }, { status: 400 });
    }

    const post = await postService.pinPost(postId, userId, isPinned);

    if (!post) {
       return NextResponse.json({ error: 'Failed to pin post. Make sure you are an admin of this community.' }, { status: 403 });
    }

    return NextResponse.json({ item: post });
  } catch (error) {
    console.error('Error pinning post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
