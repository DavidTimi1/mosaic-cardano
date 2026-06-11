import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Return empty array to handle gracefully for now
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
