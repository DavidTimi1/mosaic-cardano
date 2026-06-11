import { NextResponse } from 'next/server';
import { z } from 'zod';
import { derivedService } from '@/services/backend/derived.service';

export const runtime = 'nodejs';

const BodySchema = z.object({
  topics: z.array(z.string()).optional(),
  limit: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BodySchema.parse(body ?? {});

    const topics = parsed.topics ?? [];
    const limit = parsed.limit ?? 10;

    const communities = await derivedService.getCommunitiesByTopics(topics, limit);
    return NextResponse.json({ communities });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch communities';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
