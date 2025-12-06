import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { reportGeneratorService } from '@/services/copilot/report-generator.service';
import { logger } from '@/lib/logger';

/**
 * POST /api/v1/copilot/[assessmentId]/report
 * Generate a draft report for an assessment
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

        logger.info('Copilot report generation request', {
            service: 'CopilotAPI',
            method: 'POST /report',
            assessmentId,
            userId: session.user.id
        });

        const report = await reportGeneratorService.generateDraft(assessmentId);

        return NextResponse.json({
            success: true,
            data: report
        });
    } catch (error) {
        logger.error('Copilot report generation failed', error as Error, {
            service: 'CopilotAPI',
            method: 'POST /report'
        });

        return NextResponse.json(
            { error: 'Failed to generate report', details: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/v1/copilot/[assessmentId]/report
 * Regenerate report with analyst feedback
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { assessmentId } = await params;
        const body = await request.json();
        const { feedback } = body;

        if (!feedback || typeof feedback !== 'string') {
            return NextResponse.json(
                { error: 'Feedback is required' },
                { status: 400 }
            );
        }

        logger.info('Copilot report regeneration request', {
            service: 'CopilotAPI',
            method: 'PATCH /report',
            assessmentId,
            userId: session.user.id,
            feedbackLength: feedback.length
        });

        const report = await reportGeneratorService.regenerateWithFeedback(
            assessmentId,
            feedback
        );

        return NextResponse.json({
            success: true,
            data: report
        });
    } catch (error) {
        logger.error('Copilot report regeneration failed', error as Error, {
            service: 'CopilotAPI',
            method: 'PATCH /report'
        });

        return NextResponse.json(
            { error: 'Failed to regenerate report', details: (error as Error).message },
            { status: 500 }
        );
    }
}
