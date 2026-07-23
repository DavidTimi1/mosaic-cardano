import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

export function getQueueRedisConnection(): Redis {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableOfflineQueue: !isBuildPhase,
    });
  }
  
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableOfflineQueue: !isBuildPhase,
  });
}

// Global queue singletons to avoid creating multiple instances in Next.js dev hot-reloads
const globalForQueues = globalThis as unknown as {
  notificationQueue?: Queue;
  systemQueue?: Queue;
};

export const notificationQueue =
  globalForQueues.notificationQueue ??
  new Queue('notifications', {
    connection: getQueueRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: { age: 3600, count: 100 },
      removeOnFail: { age: 86400, count: 500 },
    },
  });

export const systemQueue =
  globalForQueues.systemQueue ??
  new Queue('system-tasks', {
    connection: getQueueRedisConnection(),
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 2000,
      },
      removeOnComplete: { age: 3600, count: 100 },
      removeOnFail: { age: 86400, count: 500 },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForQueues.notificationQueue = notificationQueue;
  globalForQueues.systemQueue = systemQueue;
}
