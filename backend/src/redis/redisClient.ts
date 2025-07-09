import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

// --- Session Token Caching ---
// Store a session token for a user (token as key, userId as value)
export async function cacheSessionToken(userId: string, token: string, ttlSeconds = 60 * 60 * 24) {
  await redis.set(`session:${userId}`, token, 'EX', ttlSeconds);
}

// Validate a session token for a user
export async function validateSessionToken(userId: string, token: string): Promise<boolean> {
  const stored = await redis.get(`session:${userId}`);
  return stored === token;
}

// Delete a session token for a user
export async function deleteSessionToken(userId: string) {
  await redis.del(`session:${userId}`);
}

// --- User Preferences (Task Filters) ---
// Save user preferences (task filters) as a JSON string
export async function setUserTaskFilter(userId: string, filter: Record<string, any>) {
  await redis.set(`user:filter:${userId}`, JSON.stringify(filter));
}

// Retrieve user preferences (task filters)
export async function getUserTaskFilter(userId: string): Promise<Record<string, any> | null> {
  const data = await redis.get(`user:filter:${userId}`);
  return data ? JSON.parse(data) : null;
}

// Remove user preferences (if needed)
export async function deleteUserTaskFilter(userId: string) {
  await redis.del(`user:filter:${userId}`);
}

export default redis;
