import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/assessments/[id]/my-questions
 * 
 * Get questions assigned to the current user for an assessment
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const assessmentId = params.id;

        // Find user's invitation
        const invitation = await prisma.assessmentInvitation.findFirst({
            where: {
                assessmentId,
                userId: session.user.id,
                status: 'ACCEPTED',
            },
            include: {
                role: true,
            },
        });

        if (!invitation) {
            return NextResponse.json(
                { error: 'No invitation found for this assessment' },
                { status: 404 }
            );
        }

        // Get assessment details
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: {
                    select: {
                        name: true,
                        description: true,
                    },
                },
            },
        });

        // Get questions assigned to user's role
        const questions = await prisma.assessmentQuestion.findMany({
            where: {
                assessmentId,
                OR: [
                    { assignedRoleId: invitation.roleId },
                    { assignedRoleId: null }, // Questions without role assignment
                ],
            },
            include: {
                question: true,
                role: true,
            },
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(
            {
                assessment,
                questions,
                invitation,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching assigned questions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
