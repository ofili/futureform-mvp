import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { organizationId, amount, type, notes } = await req.json();

        if (!organizationId || !amount || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find the credit record for the organization
        // If it doesn't exist, we might need to create it, but usually it should exist.
        // For simplicity, we assume it exists or we find the first one.
        // In a real app, we might have multiple credit buckets, but here we likely have one main one.
        let credit = await prisma.credit.findFirst({
            where: { organizationId },
        });

        if (!credit) {
            // Create a new credit record if none exists
            credit = await prisma.credit.create({
                data: {
                    organizationId,
                    amount: 0,
                    type: 'PURCHASE', // Default type for the container
                },
            });
        }

        // Create the transaction
        const transaction = await prisma.creditTransaction.create({
            data: {
                creditId: credit.id,
                userId: session.user.id, // Admin performing the action
                type: type, // PURCHASE, REFUND, etc.
                creditsChange: amount,
                notes: notes || 'Manual reconciliation by admin',
            },
        });

        // Update the credit balance
        await prisma.credit.update({
            where: { id: credit.id },
            data: {
                amount: {
                    increment: amount,
                },
            },
        });

        return NextResponse.json({ data: transaction });
    } catch (error) {
        console.error('Error processing reconciliation:', error);
        return NextResponse.json(
            { error: 'Failed to process reconciliation' },
            { status: 500 }
        );
    }
}
