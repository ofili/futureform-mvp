import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendAssessmentInvitation } from '@/lib/email';
import { logger } from '@/lib/logger';

/**
 * POST /api/v1/assessments/[id]/resend-invite
 * 
 * Resend the invitation email for a pending assessment
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

        const { id: assessmentId } = await params;

        // Get assessment with project details
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: {
                    include: {
                        organization: {
                            include: { members: true },
                        },
                    },
                },
            },
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        // Check authorization
        const isMember = assessment.project.organization?.members.some(
            (member) => member.userId === session.user.id && member.deletedAt === null
        ) ?? false;

        if (!isMember && assessment.project.createdById !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if assessment is still pending
        if (assessment.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Can only resend invite for pending assessments' },
                { status: 400 }
            );
        }

        // Check if partner email exists
        if (!assessment.partnerAdminEmail) {
            return NextResponse.json(
                { error: 'No partner email associated with this assessment' },
                { status: 400 }
            );
        }

        // Send the invitation email
        await sendAssessmentInvitation({
            to: assessment.partnerAdminEmail,
            partnerName: assessment.partnerName || 'Partner',
            projectName: assessment.project.name,
            assessmentToken: assessment.token,
            inviterUserId: session.user.id,
            inviterName: session.user.name || 'Someone',
        });

        // Update the assessment to track resend
        await prisma.assessment.update({
            where: { id: assessmentId },
            data: {
                updatedAt: new Date(),
            },
        });

        logger.info('Assessment invite resent', {
            service: 'AssessmentAPI',
            method: 'resend-invite',
            assessmentId,
            userId: session.user.id,
            partnerEmail: assessment.partnerAdminEmail,
        });

        return NextResponse.json({
            message: 'Invitation resent successfully',
            sentTo: assessment.partnerAdminEmail,
        });
    } catch (error) {
        logger.error('Error resending invite', error as Error, {
            service: 'AssessmentAPI',
            method: 'resend-invite',
        });
        return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 });
    }
}
