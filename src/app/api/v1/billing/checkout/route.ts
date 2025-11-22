import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check role: Only CREDIT_MANAGER, ADMIN (Org or Global), or OWNER can purchase
        const isGlobalAdmin = session.user.role === 'ADMIN';
        const allowedOrgRoles = ['CREDIT_MANAGER', 'ADMIN', 'OWNER'];
        const isAllowedOrgRole = allowedOrgRoles.includes(session.user.organizationRole || '');

        if (!isGlobalAdmin && !isAllowedOrgRole) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { credits } = await request.json();
        const organizationId = session.user.organizationId;

        // Mock Payment Processing
        // In a real app, we would create a Stripe session here.

        // 1. Get or create credit account
        let creditAccount = await prisma.credit.findFirst({
            where: { organizationId }
        });

        if (!creditAccount) {
            creditAccount = await prisma.credit.create({
                data: {
                    organizationId,
                    amount: 0,
                    type: 'PURCHASE',
                    description: 'Organization Credit Account'
                }
            });
        }

        // 2. Create transaction (simulating successful payment for MVP)
        await prisma.creditTransaction.create({
            data: {
                creditId: creditAccount.id,
                userId: session.user.id,
                type: 'PURCHASE',
                creditsChange: credits,
                notes: `Purchase of ${credits} credits`
            }
        });

        // 3. Update balance
        await prisma.credit.update({
            where: { id: creditAccount.id },
            data: {
                amount: { increment: credits }
            }
        });

        return NextResponse.json({
            success: true,
            url: '/dashboard/credits?success=true', // Redirect back to credits page
            message: 'Credits purchased successfully'
        });

    } catch (error) {
        console.error('Error processing checkout:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
