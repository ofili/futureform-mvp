# Rate Limiting Implementation

## Overview
Rate limiting has been implemented to protect API endpoints from abuse, brute force attacks, and DDoS attempts.

## Implementation

### Rate Limit Middleware
Location: `src/lib/rate-limit.ts`

Features:
- ✅ In-memory rate limiting (suitable for single-server deployments)
- ✅ Configurable limits and time windows
- ✅ Automatic cleanup of expired entries
- ✅ Proper HTTP 429 responses with Retry-After headers
- ✅ Support for proxies and load balancers (X-Forwarded-For, X-Real-IP, CF-Connecting-IP)
- ✅ Preset configurations for common use cases

### Preset Configurations

```typescript
import { RateLimitPresets } from '@/lib/rate-limit';

// Authentication endpoints: 5 requests/minute
RateLimitPresets.auth

// API endpoints: 30 requests/minute
RateLimitPresets.api

// Public endpoints: 100 requests/minute
RateLimitPresets.public

// Sensitive operations: 3 requests/5 minutes
RateLimitPresets.sensitive
```

## Usage Examples

### Basic Usage

```typescript
import { NextRequest } from 'next/server';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit(request, RateLimitPresets.api);
  
  if (!rateLimitResult.success) {
    return rateLimitResult.response; // Returns 429 Too Many Requests
  }
  
  // Your API logic here
  return Response.json({ success: true });
}
```

### Custom Configuration

```typescript
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, {
    limit: 10,           // 10 requests
    windowSeconds: 60,   // per minute
  });
  
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }
  
  // Your logic
}
```

### Custom Identifier (e.g., by user ID)

```typescript
import { rateLimit } from '@/lib/rate-limit';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  
  const rateLimitResult = await rateLimit(request, {
    limit: 50,
    windowSeconds: 60,
    identifier: () => session?.user?.id || 'anonymous',
  });
  
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }
  
  // Your logic
}
```

## Recommended Rate Limits by Endpoint Type

### Authentication Endpoints
**Limit: 5 requests/minute**
- `/api/auth/signin` - Login
- `/api/auth/signup` - Registration
- `/api/auth/reset-password` - Password reset

**Rationale:** Prevent brute force attacks

### Payment Endpoints
**Limit: 3 requests/5 minutes**
- `/api/payments/initiate`
- `/api/credits/purchase`

**Rationale:** Prevent payment fraud and duplicate charges

### Data Modification Endpoints
**Limit: 30 requests/minute**
- `/api/projects` (POST)
- `/api/assessments` (POST)
- `/api/v1/projects` (POST, PUT, DELETE)

**Rationale:** Prevent spam and abuse

### Read-Only Endpoints
**Limit: 100 requests/minute**
- `/api/projects` (GET)
- `/api/health` (GET)
- `/api/v1/billing/tiers` (GET)

**Rationale:** Allow reasonable usage while preventing scraping

### Public Endpoints
**Limit: 100 requests/minute**
- `/api/marketing/pql` (POST)
- `/api/framework/download` (GET)

**Rationale:** Balance accessibility with protection

## Endpoints to Protect (Priority Order)

### High Priority (Implement First)
1. ✅ `/api/auth/*` - Authentication endpoints
2. ✅ `/api/marketing/pql` - Lead capture
3. ✅ `/api/payments/*` - Payment endpoints
4. ✅ `/api/credits/*` - Credit purchase

### Medium Priority
5. `/api/v1/projects` - Project creation
6. `/api/v1/assessments` - Assessment creation
7. `/api/v1/admin/*` - Admin endpoints

### Low Priority (Optional)
8. `/api/health` - Health check
9. `/api/v1/billing/*` - Billing info (read-only)

## Implementation Checklist

- [x] Create rate limit middleware
- [x] Apply to authentication endpoints (`/api/auth/login`, `/api/auth/register`)
- [x] Apply to payment endpoints (`/api/credits/purchase`)
- [x] Apply to lead capture endpoint (`/api/marketing/pql`)
- [x] Apply to project/assessment creation (`/api/v1/projects`, `/api/v1/assessments`)
- [ ] Add rate limit monitoring (optional - log violations to Sentry)
- [ ] Document rate limits in API docs (optional)

## Production Considerations

### For Single Server Deployment
✅ Current in-memory implementation works well

### For Multi-Server Deployment
Consider upgrading to:
- **Redis-based rate limiting** (recommended)
- **Database-based rate limiting**
- **Third-party service** (Upstash, CloudFlare)

### Redis Implementation Example

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  
  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}
```

## Monitoring

### Metrics to Track
1. **Rate limit hits** - How often limits are exceeded
2. **Top offenders** - IPs hitting limits frequently
3. **Endpoint distribution** - Which endpoints get rate limited most
4. **False positives** - Legitimate users being blocked

### Logging Rate Limit Violations

```typescript
if (!rateLimitResult.success) {
  console.warn('Rate limit exceeded', {
    ip: getClientIdentifier(request),
    endpoint: request.url,
    timestamp: new Date().toISOString(),
  });
  
  // Optional: Send to monitoring service
  // Sentry.captureMessage('Rate limit exceeded', { level: 'warning', ... });
  
  return rateLimitResult.response;
}
```

## Testing Rate Limits

### Manual Testing

```bash
# Test rate limit (should succeed first 5 times, then fail)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done
```

### Automated Testing

```typescript
// tests/api/rate-limit.test.ts
describe('Rate Limiting', () => {
  it('should block after exceeding limit', async () => {
    const endpoint = '/api/auth/signin';
    
    // Make requests up to limit
    for (let i = 0; i < 5; i++) {
      const res = await fetch(endpoint, { method: 'POST' });
      expect(res.status).not.toBe(429);
    }
    
    // Next request should be rate limited
    const res = await fetch(endpoint, { method: 'POST' });
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeTruthy();
  });
});
```

## Troubleshooting

### Users Behind Same IP (Corporate Networks)
**Problem:** Multiple users share same IP, hit limits quickly

**Solutions:**
1. Use authenticated user ID as identifier
2. Increase limits for known corporate IPs
3. Implement CAPTCHA after rate limit

### Cloudflare/Proxy Issues
**Problem:** All requests show same IP

**Solution:** ✅ Already handled via proxy headers
- X-Forwarded-For
- X-Real-IP
- CF-Connecting-IP

### Rate Limit Too Strict
**Problem:** Legitimate users getting blocked

**Solutions:**
1. Increase limits
2. Reduce time window
3. Whitelist known IPs
4. Use exponential backoff

## Security Best Practices

1. ✅ **Use HTTPS** - Prevent header manipulation
2. ✅ **Validate inputs** - Don't rely solely on rate limiting
3. ✅ **Log violations** - Monitor for attacks
4. ✅ **Combine with CAPTCHA** - For auth endpoints
5. ✅ **IP whitelisting** - For known services/partners
6. ⚠️ **DDoS protection** - Use CloudFlare or similar
7. ⚠️ **WAF rules** - Web Application Firewall

## Next Steps

1. Apply rate limiting to authentication endpoints
2. Apply to payment and sensitive endpoints
3. Monitor rate limit violations
4. Adjust limits based on usage patterns
5. Consider Redis for multi-server deployments
6. Add CAPTCHA for repeated violations
