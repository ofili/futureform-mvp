import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services/evidence/evidence.service';
import { logger } from '@/lib/logger';

/**
 * PATCH /api/v1/evidence/[id]/verify
 * 
 * Verify or reject evidence
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: evidenceId } = await params;
        const body = await request.json();
        const { status, notes } = body;

        if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json(
                { error: 'Valid status (APPROVED or REJECTED) is required' },
                { status: 400 }
            );
        }

        try {
            const updatedEvidence = await evidenceService.verifyEvidenceWithAuth(
                evidenceId,
                session.user.id,
                session.user.email!,
                status,
                notes
            );

            if (!updatedEvidence) {
                return NextResponse.json(
                    { error: 'Evidence not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ evidence: updatedEvidence }, { status: 200 });
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error verifying evidence:', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
