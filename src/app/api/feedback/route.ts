import { NextResponse } from 'next/server';
import { driver } from '@/lib/backend/neo4j';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const feedbackId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const saveToDb = async () => {
      const session = driver.session();
      try {
        await session.executeWrite((tx) =>
          tx.run(
            `
            CREATE (f:Feedback {
              id: $id,
              type: $type,
              message: $message,
              createdAt: $createdAt
            })
            RETURN f
            `,
            { id: feedbackId, type, message, createdAt }
          )
        );
      } finally {
        await session.close();
      }
    };

    const sendEmail = async () => {
      if (!resend) {
        console.warn('RESEND_API_KEY not configured, skipping email.');
        return;
      }
      
      const toEmail = process.env.RESEND_TO_EMAIL || 'support@mosaic.com';
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      await resend.emails.send({
        from: `Mosaic <${fromEmail}>`,
        to: [toEmail],
        subject: `Mosaic Feedback - ${type}`,
        text: `New feedback received!\n\nType: ${type}\n\nMessage:\n${message}\n\nID: ${feedbackId}`,
      });
    };

    // Execute both tasks concurrently
    await Promise.allSettled([saveToDb(), sendEmail()]);

    return NextResponse.json({ success: true, id: feedbackId });
  } catch (error) {
    console.error('Failed to process feedback:', error);
    return NextResponse.json({ error: 'Failed to process feedback' }, { status: 500 });
  }
}
