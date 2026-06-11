import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Return default treasury format
    return NextResponse.json({
      balance: '0 SCR',
      recentAllocations: []
    });
  } catch (error) {
    console.error('Error fetching village treasury:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
