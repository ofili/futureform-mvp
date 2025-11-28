# Production Configuration Guide for FutureForm

This guide outlines the steps to properly configure the FutureForm application for production deployment.

## 1. Security Configuration

### Environment Variables Setup
Create a production `.env.production` file with the following variables:

```
# Authentication
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@host:port/database_name"

# Email Service
RESEND_API_KEY="your-resend-api-key"
NEXT_PUBLIC_CONTACT_EMAIL="contact@yourdomain.com"

# Payment Integration
FLUTTERWAVE_PUBLIC_KEY="your-flutterwave-public-key"
FLUTTERWAVE_SECRET_KEY="your-flutterwave-secret-key"

# HubSpot Integration
HUBSPOT_ACCESS_TOKEN="your-hubspot-access-token"

# Sentry Error Tracking
SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=100
```

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## 2. Database Configuration

### Production Database Setup
1. Set up a production PostgreSQL database with appropriate connection limits
2. Configure connection pooling:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['error'],
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

### Database Migration for Production
```bash
npx prisma migrate deploy
npx prisma db seed
```

## 3. Performance Optimizations

### Image Optimization
Update all image components to use next/image with proper optimization:

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>
```

### Bundle Optimization
Update next.config.js for better bundle optimization:

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
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 4. Error Handling & Monitoring

### Enhanced Error Boundaries
Create a global error boundary component:

```tsx
// components/ErrorBoundary.tsx
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

### Server-Side Sentry Configuration
Create a proper server-side Sentry configuration:

```typescript
// sentry.server.config.ts
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

## 5. Enhanced Health Check Endpoint

The existing health check is good, but can be enhanced:

```typescript
// src/app/api/health/route.ts (enhanced version)
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

## 6. SEO and Meta Tags

Create a SEO component for all pages:

```tsx
// components/SEO.tsx
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

## 7. Production Build Optimizations

Update package.json scripts for better production builds:

```json
{
  "scripts": {
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

## 8. Rate Limiting Implementation

Create a rate limiting middleware:

```typescript
// lib/rateLimit.ts
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

## 9. Production Testing Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Run `npm run type-check` with no errors
- [ ] Test production build locally with `npm start`
- [ ] Verify all environment variables are set
- [ ] Run database migrations on staging
- [ ] Test all critical user flows
- [ ] Verify HTTPS is enabled
- [ ] Test error monitoring
- [ ] Check email delivery
- [ ] Verify payment flow (if applicable)
- [ ] Test rate limiting
- [ ] Validate SEO meta tags
- [ ] Confirm health check endpoint works

## 10. Monitoring and Observability

Set up the following monitoring:

1. **Application Performance Monitoring**: Sentry
2. **Database Monitoring**: Prisma logging
3. **Uptime Monitoring**: UptimeRobot or similar
4. **Performance Monitoring**: Web Vitals monitoring
5. **Log Management**: Structured logging

This configuration will ensure the FutureForm application is production-ready with proper security, performance, and monitoring in place.