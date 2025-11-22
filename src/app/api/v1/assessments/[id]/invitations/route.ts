import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/v1/assessments/[id]/invitations
 * 
 * Send invitations to respondents for an assessment
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const assessmentId = params.id;
        const body = await request.json();
        const { invitations } = body;

        if (!Array.isArray(invitations) || invitations.length === 0) {
            return NextResponse.json(
                { error: 'Invitations array is required' },
                { status: 400 }
            );
        }

        // Verify assessment exists and user has access
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

        // Check if user has access
        const isMember = assessment.project.organization.members.some(
            (member) => member.userId === session.user.id
        );
        if (!isMember && assessment.project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Create invitations
        const createdInvitations = await Promise.all(
            invitations.map(async (inv: any) => {
                const token = generateInvitationToken();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

                const invitation = await prisma.assessmentInvitation.create({
                    data: {
                        assessmentId,
                        email: inv.email,
                        name: inv.name,
                        roleId: inv.roleId || null,
                        seniority: inv.seniority,
                        token,
                        status: 'PENDING',
                        invitedBy: session.user.id,
                        expiresAt,
                        notes: inv.notes,
                    },
                    include: {
                        role: true,
                    },
                });

                // Send invitation email
                await sendInvitationEmail(invitation, assessment);

                return invitation;
            })
        );

        // Update estimated respondents count
        await prisma.assessment.update({
            where: { id: assessmentId },
            data: {
                estimatedRespondents: createdInvitations.length,
            },
        });

        return NextResponse.json(
            { invitations: createdInvitations },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating invitations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/v1/assessments/[id]/invitations
 * 
 * Get all invitations for an assessment
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

        // Verify assessment exists and user has access
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

        // Check if user has access
        const isMember = assessment.project.organization.members.some(
            (member) => member.userId === session.user.id
        );
        if (!isMember && assessment.project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get invitations
        const invitations = await prisma.assessmentInvitation.findMany({
            where: { assessmentId },
            include: {
                role: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { invitedAt: 'desc' },
        });

        return NextResponse.json({ invitations }, { status: 200 });
    } catch (error) {
        console.error('Error fetching invitations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Generate a unique invitation token
 */
function generateInvitationToken(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
    );
}

/**
 * Send invitation email to respondent
 */
async function sendInvitationEmail(invitation: any, assessment: any) {
    const invitationUrl = `${process.env.NEXTAUTH_URL}/invitations/${invitation.token}/accept`;

    try {
        await sendEmail({
            to: invitation.email,
            subject: 'You have been invited to complete an assessment',
            html: `
        <h2>Assessment Invitation</h2>
        <p>Hello ${invitation.name || 'there'},</p>
        <p>You have been invited to participate in an assessment.</p>
        ${invitation.role ? `<p><strong>Role:</strong> ${invitation.role.name}</p>` : ''}
        ${invitation.seniority ? `<p><strong>Seniority:</strong> ${invitation.seniority}</p>` : ''}
        ${invitation.notes ? `<p><strong>Notes:</strong> ${invitation.notes}</p>` : ''}
        <p>
          <a href="${invitationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Accept Invitation
          </a>
        </p>
        <p>This invitation expires on ${invitation.expiresAt.toLocaleDateString()}.</p>
        <p>If you have any questions, please contact the assessment coordinator.</p>
      `,
        });
    } catch (error) {
        console.error('Error sending invitation email:', error);
        // Don't throw - invitation is created, email failure shouldn't block the process
    }
}
