import { Throttle } from '@nestjs/throttler';

// Strict rate limit for auth endpoints (prevent brute force)
// 5 requests per minute for login, register, forgot-password
export const ThrottleAuth = () => Throttle({ short: { ttl: 60000, limit: 5 } });

// Moderate rate limit for public endpoints
// 50 requests per minute for public product browsing, etc.
export const ThrottlePublic = () => Throttle({ short: { ttl: 60000, limit: 50 } });

// Relaxed rate limit for authenticated endpoints
// 100 requests per minute for logged-in users
export const ThrottleAuthenticated = () => Throttle({ short: { ttl: 60000, limit: 100 } });

// Very strict for sensitive operations
// 3 requests per minute for password reset, email verification
export const ThrottleSensitive = () => Throttle({ short: { ttl: 60000, limit: 3 } });
