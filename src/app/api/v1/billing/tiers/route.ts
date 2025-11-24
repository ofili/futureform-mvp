import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tiers = await prisma.subscriptionTier.findMany({
            where: { isActive: true },
            include: {
                features: {
                    orderBy: { displayOrder: 'asc' }
                }
            },
            orderBy: { displayOrder: 'asc' }
        });

        const transformedTiers = tiers.map(tier => ({
            ...tier,
            priceUSD: tier.priceUSD ? Number(tier.priceUSD) : null
        }));

        return NextResponse.json(transformedTiers);
    } catch (error) {
        console.error('Get billing tiers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
