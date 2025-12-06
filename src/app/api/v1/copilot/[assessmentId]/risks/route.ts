import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { riskFlaggerService } from '@/services/copilot/risk-flagger.service';
import { logger } from '@/lib/logger';

/**
 * GET /api/v1/copilot/[assessmentId]/risks
 * Get risk analysis for an assessment
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { assessmentId } = await params;

        logger.info('Copilot risk analysis request', {
            service: 'CopilotAPI',
            method: 'GET /risks',
            assessmentId,
            userId: session.user.id
        });

        const riskAssessment = await riskFlaggerService.analyzeRisks(assessmentId);

        return NextResponse.json({
            success: true,
            data: riskAssessment
        });
    } catch (error) {
        logger.error('Copilot risk analysis failed', error as Error, {
            service: 'CopilotAPI',
            method: 'GET /risks'
        });

        return NextResponse.json(
            { error: 'Failed to analyze risks', details: (error as Error).message },
            { status: 500 }
        );
    }
}
