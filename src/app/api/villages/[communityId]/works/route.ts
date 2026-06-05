import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Return empty array to handle gracefully
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching village works:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
