import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services/evidence/evidence.service';
import { logger } from '@/lib/logger';
import { VerificationStatus } from '@prisma/client';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { status, notes } = body;

        if (!status || !Object.values(VerificationStatus).includes(status)) {
            return NextResponse.json(
                { error: 'Valid verification status is required' },
                { status: 400 }
            );
        }

        const { id } = await params;

        try {
            const evidence = await evidenceService.validateEvidenceWithAuth(
                id,
                session.user.id,
                session.user.role,
                status as VerificationStatus,
                notes
            );

            return NextResponse.json(evidence);
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            if (error.message.includes('Evidence not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Failed to validate evidence', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
