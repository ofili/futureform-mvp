import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * PATCH /api/v1/evidence/[id]/verify
 * 
 * Verify or reject evidence
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const evidenceId = params.id;
        const body = await request.json();
        const { status, notes } = body;

        if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json(
                { error: 'Valid status (APPROVED or REJECTED) is required' },
                { status: 400 }
            );
        }

        // Get evidence with related data
        const evidence = await prisma.evidence.findUnique({
            where: { id: evidenceId },
            include: {
                response: {
                    include: {
                        assessment: {
                            include: {
                                project: {
                                    include: {
                                        organization: {
                                            include: { members: true },
                                        },
                                    },
                                },
                                invitations: true,
                            },
                        },
                    },
                },
            },
        });

        if (!evidence) {
            return NextResponse.json(
                { error: 'Evidence not found' },
                { status: 404 }
            );
        }

        // Check if user is authorized to verify evidence
        // Only organization members or partner admins can verify
        const isOrgMember = evidence.response.assessment.project.organization.members.some(
            (member) => member.userId === session.user.id
        );

        const isPartnerAdmin = evidence.response.assessment.invitations.some(
            (inv) =>
                inv.userId === session.user.id &&
                inv.status === 'ACCEPTED' &&
                inv.email === evidence.response.assessment.partnerAdminEmail
        );

        if (!isOrgMember && !isPartnerAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update evidence verification status
        const updatedEvidence = await prisma.evidence.update({
            where: { id: evidenceId },
            data: {
                verificationStatus: status,
                verifiedBy: session.user.id,
                verifiedAt: new Date(),
                verificationNotes: notes,
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
            },
        });

        return NextResponse.json({ evidence: updatedEvidence }, { status: 200 });
    } catch (error) {
        console.error('Error verifying evidence:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
