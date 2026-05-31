import { NextResponse } from 'next/server';

import { villageService } from '@/services/backend/village.service';

export const runtime = 'nodejs';

export async function GET() {
  const items = await villageService.listFeaturedVillages();
  return NextResponse.json({ items });
}