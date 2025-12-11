import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { assessmentService } from '@/services/assessments/assessment.service';
import { logger } from '@/lib/logger';

/**
 * POST /api/v1/projects/[id]/assessments
 * 
 * Create a new assessment with AI-selected questions
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: projectId } = await params;
        const body = await request.json();
        const { type, depth, sector, deadline, aiConfig, partnerAdminEmail, partnerAliasId, partnerGlobalId, trustPartnerTypeId } = body;

        // Validate required fields
        if (!type || !depth || !sector) {
            return NextResponse.json(
                { error: 'Missing required fields: type, depth, sector' },
                { status: 400 }
            );
        }

        // Delegate to service layer
        const result = await assessmentService.createProjectAssessmentWithQuestions(
            projectId,
            session.user.id,
            {
                type,
                depth,
                sector,
                deadline,
                aiConfig,
                partnerAdminEmail,
                partnerAliasId,
                partnerGlobalId,
                trustPartnerTypeId,
            }
        );

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        logger.error('Error creating assessment', error as Error, {
            service: 'ProjectAssessmentsAPI',
            method: 'POST',
        });

        // Handle specific error cases
        if (error.message === 'Project not found') {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if (error.message === 'Partner type not found') {
            return NextResponse.json({ error: 'Partner type not found' }, { status: 404 });
        }
        if (error.message === 'No questions available matching criteria') {
            return NextResponse.json({ error: 'No questions available matching criteria' }, { status: 500 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
