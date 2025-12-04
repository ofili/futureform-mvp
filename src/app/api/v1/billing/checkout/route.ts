import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { billingService } from '@/services/billing/billing.service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check permissions
        const hasPermission = billingService.verifyPurchasePermission(
            session.user.role,
            session.user.organizationRole
        );

        if (!hasPermission) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { credits, tierId } = await request.json();

        try {
            const result = await billingService.initiateFlutterwaveCheckout(
                credits,
                tierId,
                session.user.organizationId,
                session.user.id,
                session.user.email,
                session.user.name
            );

            return NextResponse.json(result);
        } catch (error: any) {
            if (error.message.includes('Invalid')) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            if (error.message.includes('Payment initialization failed')) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            throw error;
        }

    } catch (error) {
        logger.error('Error processing checkout', error as Error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
