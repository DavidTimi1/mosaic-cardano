import dotenv from 'dotenv';
dotenv.config();

import { Worker, Job } from 'bullmq';
import { Resend } from 'resend';
import webpush from 'web-push';
import { getQueueRedisConnection } from '../lib/queue';
import { notificationService } from '../services/backend/notification.service';
import { runRead, runWrite } from '../services/backend/shared';

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

      case 'broadcast-push-notifications': {
        const { audience, title, body, actionUrl } = job.data;
        console.log(`[Worker:Broadcast] 📢 Dispatching push notifications for broadcast to audience "${audience}"...`);

        let userQuery = `MATCH (u:Mosaic_User) WHERE u.pushSubscription IS NOT NULL RETURN u.pushSubscription AS sub`;
        const params: Record<string, unknown> = {};

        if (audience !== 'ALL') {
          userQuery = `MATCH (u:Mosaic_User {planType: $planType}) WHERE u.pushSubscription IS NOT NULL RETURN u.pushSubscription AS sub`;
          params.planType = audience;
        }

        const subscriptions = await runRead(userQuery, params, (row: Record<string, unknown>) => row.sub as string);
        let pushedCount = 0;

        for (const subJson of subscriptions) {
          try {
            const subscription = JSON.parse(subJson);
            await webpush.sendNotification(
              subscription,
              JSON.stringify({ title, body, url: actionUrl })
            );
            pushedCount++;
          } catch (pushErr) {
            console.error('[Worker:Broadcast] Push dispatch error:', pushErr);
          }
        }

        console.log(`[Worker:Broadcast] ✅ Web Push broadcast complete. Sent ${pushedCount} push notifications.`);
        return { pushedCount };
      }

      default:
        console.warn(`[Worker] Unknown job name: ${job.name}`);
        return { status: 'unhandled' };
    }
  },
  {
    connection: getQueueRedisConnection(),
    concurrency: 5,
    limiter: {
      max: 20,
      duration: 1000,
    },
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

import { mintCIP68Badge } from '../lib/blockchain/minting';
import { badgeService } from '../services/backend/badge.service';
import { verifyPaymentAndUpdatePlan } from '../services/backend/payment.service';
import redis from '../lib/backend/redis';

// 3. Badge Minting Queue Worker
const badgeWorker = new Worker(
  'badge-minting',
  async (job: Job) => {
    const { userId, badgeId, badgeType, walletAddress, metadata } = job.data;
    console.log(`[Worker:Badge] 🏅 Minting CIP-68 badge "${badgeType}" (${badgeId}) for user ${userId}...`);

    try {
      let txHash: string;
      let policyId: string;
      let assetNameHex: string;
      let assetNameBase: string;

      const isLive = process.env.NEXT_PUBLIC_IS_LIVE === 'true';
      const isDev = process.env.NODE_ENV === 'development';
      const isTextMode = !isLive && isDev;
      const hasWalletCredentials = Boolean(process.env.APP_WALLET_MNEMONIC && process.env.BLOCKFROST_PROJECT_ID);

      if (isTextMode && (badgeType === 'test-badge' || !hasWalletCredentials)) {
        console.log(`[Worker:Badge] 🧪 Dev environment minting for badge "${badgeType}" (${badgeId})...`);
        txHash = `mock_tx_dev_test_${Date.now()}`;
        policyId = 'mock_policy_dev_test_12345';
        assetNameBase = badgeId.substring(0, 28);
        assetNameHex = Buffer.from(assetNameBase).toString('hex');
      } else {
        const result = await mintCIP68Badge(
          walletAddress,
          badgeType,
          badgeId,
          metadata
        );
        txHash = result.txHash;
        policyId = result.policyId;
        assetNameHex = result.assetNameHex;
        assetNameBase = result.assetNameBase;
      }

      const isMainnet = isLive ? 1 : 0;
      await badgeService.markBadgeClaimed(userId, badgeId, policyId, assetNameHex, assetNameBase, txHash, isMainnet);

      // Publish real-time SSE event
      const ssePayload = JSON.stringify({
        event: 'badge_claimed',
        userId,
        badgeId,
        badgeType,
        txHash,
        policyId,
        assetNameBase,
        status: 'CLAIMED',
      });
      await redis.publish(`user:events:${userId}`, ssePayload).catch(() => {});

      // Create in-app notification
      await notificationService.createNotification({
        userId,
        type: 'SYSTEM',
        title: 'Badge Minted! 🏅',
        body: `Your Mosaic ${badgeType} badge has been successfully minted on-chain.`,
        actionUrl: `/u/${userId}`,
      }).catch(() => {});

      console.log(`[Worker:Badge] ✅ Badge ${badgeId} minted successfully! TxHash: ${txHash}`);
      return { txHash, policyId };
    } catch (err: unknown) {
      console.error(`[Worker:Badge] ❌ Minting failed for badge ${badgeId}:`, err);
      // Reset status to UNCLAIMED on final attempt failure
      if (job.attemptsMade >= (job.opts.attempts || 3) - 1) {
        await badgeService.markBadgeFailed(userId, badgeId).catch(() => {});
        const failPayload = JSON.stringify({
          event: 'badge_mint_failed',
          userId,
          badgeId,
          status: 'UNCLAIMED',
        });
        await redis.publish(`user:events:${userId}`, failPayload).catch(() => {});
      }
      throw err;
    }
  },
  {
    connection: getQueueRedisConnection(),
    concurrency: 2,
    limiter: {
      max: 5,
      duration: 1000,
    },
  }
);

// 4. Payment Verification Queue Worker
const paymentWorker = new Worker(
  'payment-verification',
  async (job: Job) => {
    const { userId, txHash, planType } = job.data;
    console.log(`[Worker:Payment] 💳 Verifying payment transaction ${txHash} for user ${userId} (Attempt ${job.attemptsMade + 1}/${job.opts.attempts})...`);

    const success = await verifyPaymentAndUpdatePlan(userId, txHash, planType);
    console.log(`[Worker:Payment] ✅ Payment ${txHash} verified successfully! Plan updated to ${planType}.`);
    return { verified: success, userId, planType };
  },
  {
    connection: getQueueRedisConnection(),
    concurrency: 3,
    limiter: {
      max: 5,
      duration: 1000,
    },
  }
);

// Event Listeners for Lifecycle Tracking
notificationWorker.on('completed', (job: Job, returnvalue: unknown) => {
  console.log(`[Worker Event] 🎉 Job #${job.id} (${job.name}) completed successfully! Result:`, returnvalue);
});

notificationWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`[Worker Event] ❌ Job #${job?.id} (${job?.name}) failed with error:`, err.message);
});

badgeWorker.on('completed', (job: Job) => {
  console.log(`[Worker Event] 🎉 Badge job #${job.id} completed!`);
});

badgeWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`[Worker Event] ❌ Badge job #${job?.id} failed:`, err.message);
});

paymentWorker.on('completed', (job: Job) => {
  console.log(`[Worker Event] 🎉 Payment job #${job.id} completed!`);
});

paymentWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`[Worker Event] ❌ Payment job #${job?.id} failed:`, err.message);
});

systemWorker.on('completed', (job: Job) => {
  console.log(`[Worker Event] 🎉 System job #${job.id} (${job.name}) completed!`);
});

console.log('✅ Workers are active and waiting for jobs in Redis...');

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down workers gracefully...');
  await Promise.all([
    notificationWorker.close(),
    systemWorker.close(),
    badgeWorker.close(),
    paymentWorker.close(),
  ]);
  console.log('👋 Workers stopped.');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('uncaughtException', (err: Error) => {
  console.error('[Worker Fatal] 💥 Uncaught Exception trapped:', err);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Worker Fatal] ⚠️ Unhandled Rejection trapped:', reason);
});
