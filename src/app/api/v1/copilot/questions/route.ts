import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { selectQuestions, isAIAvailable } from '@/lib/services/ai-question-selector';
import { logger } from '@/lib/logger';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

/**
 * POST /api/v1/copilot/questions
 * 
 * AI-powered question selection for trust assessments
 */
export async function POST(request: NextRequest) {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, RateLimitPresets.api);
    if (!rateLimitResult.success) {
        return rateLimitResult.response;
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const {
            partnerTypeId,
            partnerType,
            sector,
            region,
            assessmentType,
            depth = 'standard',
            organizationSize,
            projectContext,
            attachedDocs
        } = body;

        // Validate required fields
        if (!sector) {
            return NextResponse.json(
                { error: 'sector is required' },
                { status: 400 }
            );
        }

        logger.info('Question selection request', {
            service: 'CopilotQuestionsAPI',
            method: 'POST',
            userId: session.user.id,
            partnerType,
            sector,
            depth
        });

        // Call AI question selector
        const result = await selectQuestions({
            partnerTypeId,
            partnerType: partnerType || 'Unknown',
            sector,
            region: region || 'Global',
            assessmentType: assessmentType || 'Standard',
            depth,
            organizationSize,
            projectContext,
            attachedDocs
        });

        logger.info('Question selection complete', {
            service: 'CopilotQuestionsAPI',
            method: 'POST',
            questionsSelected: result.questions.length,
            usedAI: result.usedAI,
            tokensUsed: result.tokensUsed
        });

        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                aiAvailable: isAIAvailable(),
                usedAI: result.usedAI,
                tokensUsed: result.tokensUsed
            }
        });

    } catch (error) {
        logger.error('Question selection failed', error as Error, {
            service: 'CopilotQuestionsAPI',
            method: 'POST'
        });
        return NextResponse.json(
            { error: 'Failed to select questions' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/v1/copilot/questions
 * 
 * Check AI availability and get configuration
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: {
                aiAvailable: isAIAvailable(),
                depthOptions: {
                    quick: { questionCount: 15, description: 'Quick assessment - critical indicators only' },
                    standard: { questionCount: 30, description: 'Standard assessment - balanced coverage' },
                    deep: { questionCount: 50, description: 'Comprehensive assessment - thorough coverage' }
                },
                trustLayers: [
                    'RELIABILITY',
                    'TRANSPARENCY',
                    'GOVERNANCE',
                    'COMPETENCE',
                    'INTEGRITY',
                    'ECOSYSTEM'
                ]
            }
        });

    } catch (error) {
        logger.error('Question config fetch failed', error as Error, {
            service: 'CopilotQuestionsAPI',
            method: 'GET'
        });
        return NextResponse.json(
            { error: 'Failed to fetch configuration' },
            { status: 500 }
        );
    }
}
