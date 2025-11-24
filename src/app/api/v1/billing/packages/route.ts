import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const packages = await prisma.creditPricing.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' }
        });

        const transformedPackages = packages.map(pkg => ({
            ...pkg,
            priceUSD: Number(pkg.priceUSD)
        }));

        return NextResponse.json(transformedPackages);
    } catch (error) {
        console.error('Get billing packages error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
