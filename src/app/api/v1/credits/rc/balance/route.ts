import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rcService } from '@/services';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get organization ID from query param or session (assuming user belongs to one org for now)
        // In a real multi-tenant app, we'd get this from the session or context
        const organizationId = req.nextUrl.searchParams.get('organizationId');

        if (!organizationId) {
            return NextResponse.json(
                { error: 'Organization ID is required' },
                { status: 400 }
            );
        }

        // Check if user has access to this organization
        // TODO: Add proper authorization check here

        const balance = await rcService.getBalance(organizationId);

        return NextResponse.json(balance);
    } catch (error) {
        logger.error('Failed to get RC balance', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
