import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const rateLimitStore: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach((key) => {
        if (rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key];
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    /**
     * Maximum number of requests allowed in the time window
     */
    limit: number;

    /**
     * Time window in seconds
     */
    windowSeconds: number;

    /**
     * Custom identifier function (default: uses IP address)
     */
    identifier?: (request: NextRequest) => string;
}

/**
 * Rate limiting middleware
 * 
 * @example
 * ```typescript
 * import { rateLimit } from '@/lib/rate-limit';
 * 
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimit(request, {
 *     limit: 10,
 *     windowSeconds: 60
 *   });
 *   
 *   if (!rateLimitResult.success) {
 *     return rateLimitResult.response;
 *   }
 *   
 *   // Your API logic here
 * }
 * ```
 */
export async function rateLimit(
    request: NextRequest,
    config: RateLimitConfig
): Promise<{ success: boolean; response?: NextResponse }> {
    const { limit, windowSeconds, identifier } = config;

    // Get identifier (IP address by default)
    const key = identifier
        ? identifier(request)
        : getClientIdentifier(request);

    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    // Initialize or get existing rate limit data
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
        rateLimitStore[key] = {
            count: 0,
            resetTime: now + windowMs,
        };
    }

    // Increment request count
    rateLimitStore[key].count++;

    // Check if limit exceeded
    if (rateLimitStore[key].count > limit) {
        const resetIn = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);

        return {
            success: false,
            response: NextResponse.json(
                {
                    error: 'Too many requests',
                    message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
                    retryAfter: resetIn,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': resetIn.toString(),
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimitStore[key].resetTime.toString(),
                    },
                }
            ),
        };
    }

    // Rate limit not exceeded
    const remaining = limit - rateLimitStore[key].count;

    return {
        success: true,
        response: undefined,
    };
}

/**
 * Get client identifier from request
 * Uses IP address, with fallbacks for various proxy headers
 */
function getClientIdentifier(request: NextRequest): string {
    // Try to get real IP from various headers (for proxies/load balancers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, get the first one
        return forwardedFor.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Fallback to a default identifier
    return 'unknown';
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
    /**
     * Strict rate limit for authentication endpoints
     * 5 requests per minute
     */
    auth: {
        limit: 5,
        windowSeconds: 60,
    },

    /**
     * Moderate rate limit for API endpoints
     * 30 requests per minute
     */
    api: {
        limit: 30,
        windowSeconds: 60,
    },

    /**
     * Lenient rate limit for public endpoints
     * 100 requests per minute
     */
    public: {
        limit: 100,
        windowSeconds: 60,
    },

    /**
     * Very strict for sensitive operations
     * 3 requests per 5 minutes
     */
    sensitive: {
        limit: 3,
        windowSeconds: 300,
    },
} as const;

/**
 * Helper function to add rate limit headers to a response
 */
export function addRateLimitHeaders(
    response: NextResponse,
    limit: number,
    remaining: number,
    resetTime: number
): NextResponse {
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());

    return response;
}
