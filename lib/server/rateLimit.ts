import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

const minuteBuckets = new Map<string, Bucket>();
const dayBuckets = new Map<string, Bucket>();

const MINUTE_LIMIT = 20;
const MINUTE_MS = 60_000;
const DAY_LIMIT = 200;
const DAY_MS = 86_400_000;

function checkBucket(map: Map<string, Bucket>, key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = map.get(key);

  if (!bucket || now >= bucket.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function checkRateLimit(ip: string, sessionId: string): boolean {
  const ipMinute = checkBucket(minuteBuckets, `m:ip:${ip}`, MINUTE_LIMIT, MINUTE_MS);
  const sessionMinute = checkBucket(minuteBuckets, `m:s:${sessionId}`, MINUTE_LIMIT, MINUTE_MS);
  const ipDay = checkBucket(dayBuckets, `d:ip:${ip}`, DAY_LIMIT, DAY_MS);
  const sessionDay = checkBucket(dayBuckets, `d:s:${sessionId}`, DAY_LIMIT, DAY_MS);
  return ipMinute && sessionMinute && ipDay && sessionDay;
}

export function getClientIp(forwardedFor: string | null): string {
  if (!forwardedFor) return "unknown";
  const first = forwardedFor.split(",")[0]?.trim();
  return first || "unknown";
}
