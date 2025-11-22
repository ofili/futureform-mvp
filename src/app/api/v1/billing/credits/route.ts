import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organizationId = session.user.organizationId;

        const creditAccount = await prisma.credit.findFirst({
            where: { organizationId }
        });

        return NextResponse.json({
            balance: creditAccount?.amount || 0
        });

    } catch (error) {
        console.error('Error fetching credits:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
