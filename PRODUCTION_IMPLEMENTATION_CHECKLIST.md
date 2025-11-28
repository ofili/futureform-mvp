# Production Implementation Checklist

This checklist details specific code changes needed to make the FutureForm application production-ready.

## 1. Security Implementations

### A. Create Error Boundary Component
Create `/src/components/ErrorBoundary.tsx`:

```tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">
              We've been notified and are working to fix the issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### B. Update Server-Side Sentry Configuration
Update `/sentry.server.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  environment: process.env.NODE_ENV || 'development',

  // Only enable Sentry in production
  enabled: process.env.NODE_ENV === 'production',

  // Configure how many errors are sent to Sentry
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

### C. Add Rate Limiting Middleware
Create `/src/lib/rateLimit.ts`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let rateLimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  });
}

export default rateLimit;
```

## 2. Performance Optimizations

### A. Create SEO Component
Create `/src/components/SEO.tsx`:

```tsx
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  noIndex?: boolean;
}

export default function SEO({ 
  title, 
  description, 
  keywords, 
  canonical, 
  noIndex = false 
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}
```

### B. Update Next.js Configuration
Enhance `/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'futureform-files.s3.amazonaws.com',
      },
    ],
    formats: ['image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  webpack(config) {
    // Enable tree shaking and dead code elimination
    config.optimization.usedExports = true;
    config.optimization.providedExports = true;
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 3. API Route Enhancements

### A. Enhance Health Check Endpoint
Update `/src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Enhanced Health Check Endpoint
 * Returns the health status of the application and its dependencies
 * GET /api/health
 */
export async function GET() {
  try {
    const startTime = Date.now();

    // Check database connectivity
    let dbStatus = 'healthy';
    let dbLatency = 0;

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'unhealthy';
      console.error('Database health check failed:', error);
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryStatus = memoryUsage.heapUsed > 500 * 1024 * 1024 ? 'warning' : 'healthy'; // 500MB threshold

    // Check environment
    const environment = process.env.NODE_ENV || 'development';
    const isProduction = environment === 'production';

    const totalLatency = Date.now() - startTime;
    const isHealthy = dbStatus === 'healthy';

    const healthData = {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: environment,
      version: process.env.npm_package_version || '1.0.0',
      isProduction: isProduction,
      checks: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
        memory: {
          status: memoryStatus,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        },
      },
      latency: `${totalLatency}ms`,
    };

    return NextResponse.json(
      healthData,
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
```

## 4. Update Package.json Scripts

Add type checking and analysis scripts to `/package.json`:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate --schema ./prisma/schema.prisma",
    "dev": "prisma generate --schema ./prisma/schema.prisma && next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:db:reset": "dotenv -e .env.test -- prisma migrate reset --force",
    "analyze": "ANALYZE=true next build",
    "type-check": "tsc --noEmit"
  }
}
```

## 5. Add Proper Error Pages

### A. Create Custom Error Page
Create `/src/app/error.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught by error.tsx:', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-8">
          We've been notified and are working to fix the issue.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

### B. Create Not Found Page
Update `/src/app/not-found.tsx` if needed:

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

## 6. Add Loading States

### A. Create Loading Component
Create `/src/components/LoadingSpinner.tsx`:

```tsx
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

## 7. Update Prisma Client Configuration

Update `/src/lib/prisma.ts` for production:

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
```

## 8. Implementation Priority

### Critical (Do First)
1. [ ] Create error boundary component
2. [ ] Update server-side Sentry configuration
3. [ ] Add type checking script to package.json
4. [ ] Enhance health check endpoint
5. [ ] Add proper error pages

### Important (Do Next)
1. [ ] Add rate limiting middleware
2. [ ] Create SEO component
3. [ ] Update Next.js configuration for security headers
4. [ ] Add loading states
5. [ ] Update Prisma client configuration

### Nice to Have (Post-Launch)
1. [ ] Implement Redis caching
2. [ ] Add comprehensive logging
3. [ ] Set up performance monitoring
4. [ ] Add accessibility improvements
5. [ ] Implement service worker for offline support

This implementation checklist provides specific code changes needed to make the FutureForm application production-ready.