// Get payment transactions for an organization
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { paymentService } from '@/services/payments/payment.service';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const organizationId = searchParams.get('organizationId');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!organizationId) {
            return NextResponse.json(
                { error: 'Organization ID is required' },
                { status: 400 }
            );
        }

        // Authorization: verify user belongs to organization
        const isAdmin = session.user.role === 'ADMIN';

        if (!isAdmin) {
            const hasAccess = await paymentService.verifyOrganizationAccess(session.user.id, organizationId);

            if (!hasAccess) {
                return NextResponse.json(
                    { error: 'Forbidden: You do not have access to this organization' },
                    { status: 403 }
                );
            }
        }

        // Fetch transactions
        const transactions = await paymentService.getOrganizationTransactions(organizationId, limit);

        return NextResponse.json({ transactions });
    } catch (error) {
        logger.error('Failed to fetch transactions', error as Error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
