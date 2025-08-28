import { rateLimiter } from 'hono-rate-limiter';

export const limiter = rateLimiter({ windowMs: 60000, limit: 60, keyGenerator: c => c.req.header('x-forwarded-for') || 'unknown', message: 'Too many requests' });
