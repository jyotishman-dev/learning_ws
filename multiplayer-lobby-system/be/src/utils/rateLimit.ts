import { rateLimits } from "../state.js";


export function checkRateLimit(
  socketId: string,
  limit = 10,
  windowMs = 1000
): boolean {
  const now = Date.now();
  let entry = rateLimits.get(socketId);

  // naya window ya pehli baar
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    rateLimits.set(socketId, entry);
  }

  entry.count++;
  return entry.count <= limit;
}

// disconnect pe clear karo — warna memory leak
export function clearRateLimit(socketId: string) {
  rateLimits.delete(socketId);
}