import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { assessmentService } from '@/services/assessments/assessment.service';
import { logger } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        try {
            const assessment = await assessmentService.getById(id, session.user.id);
            return NextResponse.json(assessment);
        } catch (error: any) {
            if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            if (error.message.includes('Assessment not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Get assessment error', error as Error, {
            service: 'AssessmentAPI',
            method: 'GET',
        });
        return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
    }
}

/**
 * DELETE /api/v1/assessments/[id]
 * Remove a partner from an assessment
 * Only org admin or assessment creator can remove
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        try {
            const result = await assessmentService.removePartnerFromAssessment(
                id,
                session.user.id
            );

            return NextResponse.json({
                message: 'Partner removed from assessment successfully',
                emailSent: result.emailSent,
            });
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            if (error.message.includes('Assessment not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Delete assessment error', error as Error, {
            service: 'AssessmentAPI',
            method: 'DELETE',
        });
        return NextResponse.json({ error: 'Failed to remove partner' }, { status: 500 });
    }
}
