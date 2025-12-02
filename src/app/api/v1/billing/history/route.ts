import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organizationId = session.user.organizationId;

        // Find the credit account for the organization
        const creditAccount = await prisma.credit.findFirst({
            where: { organizationId }
        });

        if (!creditAccount) {
            return NextResponse.json({ payments: [] });
        }

        const transactions = await prisma.creditTransaction.findMany({
            where: { creditId: creditAccount.id },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        // Map to expected format for frontend
        const payments = transactions.map(tx => ({
            id: tx.id,
            amount: tx.creditsChange, // This is credits, not currency amount. Frontend might expect currency if it's "Billing History".
            // If we want to show currency, we'd need to store it or calculate it.
            // For now, we'll return the credit change as amount and clarify in UI.
            status: 'COMPLETED', // Transactions are usually completed records
            createdAt: tx.createdAt,
            type: tx.type,
            user: `${tx.user.firstName} ${tx.user.lastName}`
        }));

        return NextResponse.json({ payments });

    } catch (error) {
        console.error('Error fetching billing history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
