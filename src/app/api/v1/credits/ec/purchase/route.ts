import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ecService } from '@/services';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { organizationId, amount, packageId, notes } = body;

        if (!organizationId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // In a real implementation, this would be called by the billing service/webhook
        // after successful payment. For now, we allow direct purchase for testing/admin.
        // TODO: Add admin-only check or verify payment token

        const transaction = await ecService.purchaseEC(
            organizationId,
            amount,
            packageId,
            notes
        );

        return NextResponse.json(transaction);
    } catch (error) {
        logger.error('Failed to purchase EC credits', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
