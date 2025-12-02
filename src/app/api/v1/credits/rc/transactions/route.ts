import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rcService } from '@/services';
import { logger } from '@/lib/logger';
import { RCTxType } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organizationId = req.nextUrl.searchParams.get('organizationId');
        const limit = req.nextUrl.searchParams.get('limit');
        const offset = req.nextUrl.searchParams.get('offset');
        const type = req.nextUrl.searchParams.get('type') as RCTxType | undefined;

        if (!organizationId) {
            return NextResponse.json(
                { error: 'Organization ID is required' },
                { status: 400 }
            );
        }

        const transactions = await rcService.getTransactionHistory(organizationId, {
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
            type,
        });

        return NextResponse.json(transactions);
    } catch (error) {
        logger.error('Failed to get RC transactions', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
