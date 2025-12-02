import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ecService } from '@/services';
import { logger } from '@/lib/logger';
import { InsufficientCreditsError, CreditExpiredError } from '@/lib/errors/credit-errors';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { organizationId, evidenceType, evidenceId, assessmentId, notes } = body;

        if (!organizationId || !evidenceType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const transaction = await ecService.consumeEC(
            organizationId,
            evidenceType,
            evidenceId,
            assessmentId,
            notes
        );

        return NextResponse.json(transaction);
    } catch (error) {
        if (error instanceof InsufficientCreditsError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: 402 }
            );
        }
        if (error instanceof CreditExpiredError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: 410 }
            );
        }

        logger.error('Failed to consume EC credits', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
