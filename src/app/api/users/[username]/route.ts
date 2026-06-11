import { NextResponse } from 'next/server';
import { authService } from '@/services/backend/auth.service';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const user = await authService.getUserByUsername(username);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = {
      id: user.id,
      displayName: user.displayName,
      handle: `@${user.username}`,
      bio: user.bio || 'A mysterious artisan.',
      joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isVerified: user.isVerified || false,
      walletAddress: user.walletAddress || '',
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
