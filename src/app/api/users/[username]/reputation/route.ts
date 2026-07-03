import { NextResponse } from 'next/server';
import { authService } from '@/services/backend/auth.service';
import { settingsService } from '@/services/backend/settings.service';
import { badgeService } from '@/services/backend/badge.service';

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

    const settings = await settingsService.getSettings(user.id);
    
    // Return default empty reputation schema, respecting privacy settings
    let userBadges: { id: string; type: string; status: string }[] = [];
    if (settings.profile.showBadges) {
      const realBadges = await badgeService.getUserBadges(user.id);
      userBadges = realBadges.map(b => ({
        id: b.id,
        type: b.type,
        status: b.status
      }));
    }

    const defaultReputation = {
      badges: userBadges,
      skills: [],
      communities: settings.profile.showCommunities ? [
        // Mock community if visible
        { id: 'c1', name: 'Artisans', role: 'Member' }
      ] : [],
      projects: [],
      supportHistory: []
    };
    return NextResponse.json(defaultReputation);
  } catch (error) {
    console.error('Error fetching user reputation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
