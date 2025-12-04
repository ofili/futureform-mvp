import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { billingService } from '@/services/billing/billing.service';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await billingService.getBillingHistory(session.user.organizationId);

        return NextResponse.json(result);

    } catch (error) {
        logger.error('Error fetching billing history', error as Error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
