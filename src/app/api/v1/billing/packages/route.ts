import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { billingService } from '@/services/billing/billing.service';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const packages = await billingService.getCreditPackages();

        return NextResponse.json(packages);
    } catch (error) {
        logger.error('Get billing packages error', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
