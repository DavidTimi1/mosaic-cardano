import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Currently no artifacts linked to users in Neo4j schema
    // Return empty array to handle gracefully
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching user works:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
