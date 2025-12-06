import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { summarizerService } from '@/services/copilot/summarizer.service';
import { logger } from '@/lib/logger';

/**
 * POST /api/v1/copilot/[assessmentId]/summarize
 * Generate a summary of assessment responses
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { assessmentId } = await params;

        logger.info('Copilot summarize request', {
            service: 'CopilotAPI',
            method: 'POST /summarize',
            assessmentId,
            userId: session.user.id
        });

        const summary = await summarizerService.summarizeAssessment(assessmentId);

        return NextResponse.json({
            success: true,
            data: summary
        });
    } catch (error) {
        logger.error('Copilot summarize failed', error as Error, {
            service: 'CopilotAPI',
            method: 'POST /summarize'
        });

        return NextResponse.json(
            { error: 'Failed to generate summary', details: (error as Error).message },
            { status: 500 }
        );
    }
}
