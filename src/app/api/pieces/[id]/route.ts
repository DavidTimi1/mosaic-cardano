import { NextResponse } from 'next/server';
import { pieceService } from '@/services/backend/piece.service';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Piece ID is required' }, { status: 400 });
    }

    const piece = await pieceService.getPieceById(id);

    if (!piece) {
      return NextResponse.json({ error: 'Piece not found' }, { status: 404 });
    }

    return NextResponse.json({ piece });
  } catch (error) {
    console.error('Error fetching piece details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
