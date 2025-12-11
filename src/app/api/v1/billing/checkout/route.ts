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

        const body = await request.json();
        const { packageId, type, amount, organizationId } = body;

        // Validate organization matches session
        if (organizationId && organizationId !== session.user.organizationId) {
            return NextResponse.json({ error: 'Organization mismatch' }, { status: 403 });
        }

        try {
            let result;

            if (packageId) {
                // Package purchase
                result = await billingService.initiateFlutterwaveCheckout(
                    undefined, // credits
                    packageId, // tierId (package ID in this context)
                    session.user.organizationId,
                    session.user.id,
                    session.user.email,
                    session.user.name
                );
            } else if (type && amount) {
                // Custom credit purchase
                const pricePerCredit = type === 'RC' ? 350 : 50; // USD
                const totalAmount = amount * pricePerCredit;

                result = await billingService.initiateFlutterwaveCheckout(
                    amount,
                    undefined, // No tier
                    session.user.organizationId,
                    session.user.id,
                    session.user.email,
                    session.user.name
                );

                // Add credit type to result for frontend reference
                result = { ...result, creditType: type, creditAmount: amount, totalAmount };
            } else {
                return NextResponse.json({ error: 'Invalid request: provide packageId or type+amount' }, { status: 400 });
            }

            // Transform response to use checkoutUrl (billing service returns 'url')
            const resultAny = result as any;
            const response = {
                ...result,
                checkoutUrl: resultAny.url || resultAny.checkoutUrl,
            };

            return NextResponse.json(response);
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
