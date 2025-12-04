// Payment initialization endpoint
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { paymentService } from '@/services/payments/payment.service';
import { PaymentType } from '@/lib/payments/payment.types';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, organizationId, amount, currency, tierId, packageId } = body;

        // Validate required fields
        if (!type || !organizationId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: type, organizationId, amount' },
                { status: 400 }
            );
        }

        // Validate payment type
        if (!Object.values(PaymentType).includes(type)) {
            return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
        }

        // Authorization: verify user belongs to organization and has admin role
        const isAdmin = session.user.role === 'ADMIN';

        if (!isAdmin) {
            const userOrg = await prisma.organizationMember.findFirst({
                where: {
                    userId: session.user.id,
                    organizationId,
                    role: 'ADMIN',
                    deletedAt: null
                }
            });

            if (!userOrg) {
                return NextResponse.json(
                    { error: 'Forbidden: Only organization admins can initiate payments' },
                    { status: 403 }
                );
            }
        }

        // Delegate to service layer
        const result = await paymentService.initializePayment(session.user.id, {
            type,
            organizationId,
            amount,
            currency: currency || 'NGN',
            tierId,
            packageId,
            customerEmail: session.user.email!,
            customerName: session.user.name || 'Customer',
        });

        return NextResponse.json(result);
    } catch (error) {
        logger.error('Payment initialization failed', error as Error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
