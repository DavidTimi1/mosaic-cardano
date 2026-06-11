import { NextResponse } from 'next/server';
import { authService } from '@/services/backend/auth.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }
    
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
       return NextResponse.json({ available: false, error: 'Invalid username format' }, { status: 200 });
    }

    const user = await authService.getUserByUsername(username);
    
    // If user is null, username is available
    return NextResponse.json({ available: user === null });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
