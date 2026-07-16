import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/backend/request';
import { documentService } from '@/services/backend/document.service';
import { uploadFileToIPFS } from '@/lib/ipfs';
import { z } from 'zod';

export const runtime = 'nodejs';

const FreezeSchema = z.object({
  communityId: z.string().min(1)
});


/**
 * @swagger
 * /api/documents/[documentId]/freeze:
 *   post:
 *     summary: POST freeze
 *     tags: [api]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const POST = withAuth(async (request, { params }, userId) => {
  try {
    const { documentId } = await params as { documentId: string };
    
    const body = await request.json();
    const parseResult = FreezeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const doc = await documentService.getDocument(documentId, userId);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    if (doc.creator?.id !== userId) {
      return NextResponse.json({ error: 'Only the creator can freeze the document' }, { status: 403 });
    }

    // Fetch raw content from Cloudinary
    let contentRaw = '';
    if (doc.contentUrl) {
      try {
        const response = await fetch(doc.contentUrl);
        if (response.ok) {
          contentRaw = await response.text();
        }
      } catch (err) {
        console.error('Failed to fetch content from Cloudinary:', err);
      }
    }

    // Freeze raw content to IPFS directly as a Blob
    // This allows the frontend to simply fetch(ipfsUrl) and get the raw Markdown
    const contentBlob = new Blob([contentRaw || ''], { type: 'text/markdown' });
    
    const contentIpfsHash = await uploadFileToIPFS(contentBlob, `${doc.title} - Content`);
    
    // Determine the next publish stage based on contributors count
    const isSingleContributor = !doc.contributions || doc.contributions.length <= 1;
    const nextStage = isSingleContributor ? 'waiting' : 'propose';

    // Save CID and advance state
    await documentService.updateDocument(documentId, userId, {
      communityId: parseResult.data.communityId,
      contentUrl: contentIpfsHash,
      publishStage: nextStage
    });

    return NextResponse.json({ success: true, contentUrl: contentIpfsHash });
  } catch (error: unknown) {
    console.error('Failed to freeze document:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
});
