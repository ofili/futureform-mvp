import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/assessments/[id]/evidence
 * 
 * Get all evidence for an assessment (admin only)
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

        // Verify user has access to this assessment
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
            return NextResponse.json(
                { error: 'Assessment not found' },
                { status: 404 }
            );
        }

        // Check if user is org member or partner admin
        const isOrgMember = assessment.project.organization.members.some(
            (member) => member.userId === session.user.id
        );
        const isPartnerAdmin = assessment.partnerAdminEmail === session.user.email;

        if (!isOrgMember && !isPartnerAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get all evidence for this assessment
        const evidence = await prisma.evidence.findMany({
            where: {
                response: {
                    assessmentId,
                },
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                verifier: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                response: {
                    include: {
                        question: true,
                    },
                },
            },
            orderBy: { uploadedAt: 'desc' },
        });

        return NextResponse.json({ evidence }, { status: 200 });
    } catch (error) {
        console.error('Error fetching evidence:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
