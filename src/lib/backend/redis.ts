import { Redis } from 'ioredis';

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });

redis.on('connect', () => {
  console.log('✅ Connected to Redis cache');
});

export default redis;