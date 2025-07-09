import redis from '../redis/redisClient';

export async function cacheSessionToken(userId: string, token: string) {
  await redis.set(`session:${userId}`, token, 'EX', 60 * 60 * 24); // 24 hrs
}

export async function validateSessionToken(userId: string, token: string) {
  const stored = await redis.get(`session:${userId}`);
  return stored === token;
}

export async function deleteSessionToken(userId: string) {
  await redis.del(`session:${userId}`);
}
