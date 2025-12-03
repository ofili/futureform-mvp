import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services/evidence/evidence.service';
import { logger } from '@/lib/logger';
import { InsufficientCreditsError, CreditExpiredError, EvidenceValidationError } from '@/lib/errors/credit-errors';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { organizationId, type, category, fileName, fileUrl, fileType, fileSize, metadata, responseId } = body;

        if (!organizationId) {
            return NextResponse.json(
                { error: 'Organization ID is required' },
                { status: 400 }
            );
        }

        const submission = await evidenceService.submitVE(organizationId, {
            type,
            category,
            fileName,
            fileUrl,
            fileType,
            fileSize,
            metadata,
            responseId,
            uploadedBy: session.user.id,
        });

        return NextResponse.json(submission);
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
        if (error instanceof EvidenceValidationError) {
            return NextResponse.json(
                { error: error.message, details: error.validationErrors },
                { status: 400 }
            );
        }

        logger.error('Failed to submit VE evidence', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
