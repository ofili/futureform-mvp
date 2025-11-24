import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Health Check Endpoint
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

        const totalLatency = Date.now() - startTime;
        const isHealthy = dbStatus === 'healthy';

        const healthData = {
            status: isHealthy ? 'ok' : 'error',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            checks: {
                database: {
                    status: dbStatus,
                    latency: `${dbLatency}ms`,
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
            },
            { status: 503 }
        );
    }
}
