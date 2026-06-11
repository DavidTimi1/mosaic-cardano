import { NextResponse } from 'next/server';
import { authService } from '@/services/backend/auth.service';
import { settingsService } from '@/services/backend/settings.service';

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
    const defaultReputation = {
      badges: settings.profile.showBadges ? [
        // Mock badge if visible
        { id: '1', name: 'Early Adopter', icon: '🌟' }
      ] : [],
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
