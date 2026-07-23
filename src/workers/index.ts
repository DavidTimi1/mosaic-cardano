import { Worker, Job } from 'bullmq';
import { Resend } from 'resend';
import { getQueueRedisConnection } from '../lib/queue';
import { notificationService } from '../services/backend/notification.service';
import { runWrite } from '../services/backend/shared';

console.log('🚀 Starting Mosaic Background Worker Daemon...');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// 1. Notification Queue Worker
const notificationWorker = new Worker(
  'notifications',
  async (job: Job) => {
    console.log(`[Worker] 📥 Processing job #${job.id} (${job.name})`);

    switch (job.name) {
      case 'send-feedback-notification': {
        const { feedbackId, feedbackType, feedbackText, name, email, submitterId } = job.data;
        console.log(`[Worker:Feedback] 📧 Dispatching feedback email notification for feedback #${feedbackId} (user: ${submitterId})`);

        const toEmail = process.env.RESEND_TO_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_MAIL;
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        if (!resend || !toEmail || !fromEmail) {
          console.warn('[Worker:Feedback] ⚠️ RESEND environment not fully configured (RESEND_API_KEY missing), skipping email delivery.');
          return { sent: false, reason: 'RESEND_NOT_CONFIGURED' };
        }

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          subject: `Mosaic Feedback - ${feedbackType}`,
          html: `
            <h1>New feedback received!</h1>
            <p><strong>Type:</strong> ${feedbackType}</p>
            <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
            <p><strong>Email:</strong> ${email || 'Anonymous'}</p>
            <p><strong>Message:</strong> ${feedbackText}</p>
            <p><strong>ID:</strong> ${feedbackId}</p>
            ${email ? `<a href="mailto:${email}?subject=Reply to Mosaic feedback&body=Hi ${name}, ${feedbackType === 'bug' ? 'we are sorry to hear that you are experiencing issues with our platform. ' : 'we appreciate your feedback.'} we have received your feedback with ID: ${feedbackId} and will get back to you as soon as possible.">Reply to this feedback</a>` : ''}
          `,
        });

        console.log(`[Worker:Feedback] ✅ Email successfully sent via Resend! Result ID: ${emailResult.data?.id || 'OK'}`);
        return { sent: true, emailId: emailResult.data?.id };
      }

      case 'create-inapp-notification': {
        const { userId, type, title, body, actionUrl, aggregationKey } = job.data;
        console.log(`[Worker:Notification] 🔔 Creating in-app notification for user ${userId}: "${title}"`);

        const notification = await notificationService.createNotification({
          userId,
          type,
          title,
          body,
          actionUrl,
          aggregationKey,
        });

        console.log(`[Worker:Notification] ✅ In-app notification #${notification.id} created and web-push dispatched.`);
        return { notificationId: notification.id };
      }

      default:
        console.warn(`[Worker] Unknown job name: ${job.name}`);
        return { status: 'unhandled' };
    }
  },
  {
    connection: getQueueRedisConnection(),
    concurrency: 5,
  }
);

// 2. System Tasks Queue Worker
const systemWorker = new Worker(
  'system-tasks',
  async (job: Job) => {
    console.log(`[Worker:System] 📥 Processing system task #${job.id} (${job.name})`);

    if (job.name === 'cleanup-expired-sessions') {
      console.log(`[Worker:System] 🧹 Executing database cleanup for expired sessions...`);
      const now = Date.now();

      await runWrite(
        `
          MATCH (s:Mosaic_Session)
          WHERE s.expiresAt IS NOT NULL AND s.expiresAt < $now
          DELETE s
          RETURN count(s) AS deletedCount
        `,
        { now },
        (row) => row.deletedCount
      );

      console.log(`[Worker:System] ✅ Database cleanup finished.`);
      return { cleaned: true };
    }

    return { status: 'completed' };
  },
  {
    connection: getQueueRedisConnection(),
    concurrency: 2,
  }
);

// Event Listeners for Lifecycle Tracking
notificationWorker.on('completed', (job: Job, returnvalue: unknown) => {
  console.log(`[Worker Event] 🎉 Job #${job.id} (${job.name}) completed successfully! Result:`, returnvalue);
});

notificationWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`[Worker Event] ❌ Job #${job?.id} (${job?.name}) failed with error:`, err.message);
});

systemWorker.on('completed', (job: Job) => {
  console.log(`[Worker Event] 🎉 System job #${job.id} (${job.name}) completed!`);
});

console.log('✅ Workers are active and waiting for jobs in Redis...');

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down workers gracefully...');
  await Promise.all([notificationWorker.close(), systemWorker.close()]);
  console.log('👋 Workers stopped.');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
