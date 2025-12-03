import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rcService } from '@/services/credits/rc.service';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';

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

        // Authorization: Only platform admins or org admins can purchase credits
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
                    { error: 'Forbidden: Only organization admins can purchase credits' },
                    { status: 403 }
                );
            }
        }

        const transaction = await rcService.purchaseRC(
            organizationId,
            amount,
            packageId,
            notes
        );

        return NextResponse.json(transaction);
    } catch (error) {
        logger.error('Failed to purchase RC credits', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
