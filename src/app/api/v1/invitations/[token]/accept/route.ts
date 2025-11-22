import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * POST /api/v1/invitations/[token]/accept
 * 
 * Accept an assessment invitation
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token;
        const body = await request.json();
        const { password } = body;

        // Find invitation
        const invitation = await prisma.assessmentInvitation.findUnique({
            where: { token },
            include: {
                assessment: {
                    include: {
                        project: true,
                        assessmentQuestions: {
                            where: {
                                OR: [
                                    { assignedRoleId: null }, // Questions without role assignment
                                    { assignedRoleId: { not: null } }, // Will filter by role after user is linked
                                ],
                            },
                            include: {
                                question: true,
                                role: true,
                            },
                        },
                    },
                },
                role: true,
            },
        });

        if (!invitation) {
            return NextResponse.json(
                { error: 'Invalid invitation token' },
                { status: 404 }
            );
        }

        // Check if invitation is expired
        if (new Date() > invitation.expiresAt) {
            return NextResponse.json(
                { error: 'Invitation has expired' },
                { status: 400 }
            );
        }

        // Check if already accepted
        if (invitation.status === 'ACCEPTED') {
            return NextResponse.json(
                { error: 'Invitation already accepted' },
                { status: 400 }
            );
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email: invitation.email },
        });

        // Create user if doesn't exist
        if (!user) {
            if (!password) {
                return NextResponse.json(
                    { error: 'Password required for new users' },
                    { status: 400 }
                );
            }

            // Hash password (you should use bcrypt in production)
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 10);

            user = await prisma.user.create({
                data: {
                    email: invitation.email,
                    password: hashedPassword,
                    firstName: invitation.name?.split(' ')[0] || 'User',
                    lastName: invitation.name?.split(' ').slice(1).join(' ') || '',
                    role: 'USER',
                    verified: true,
                    emailVerified: true,
                },
            });
        }

        // Update invitation
        await prisma.assessmentInvitation.update({
            where: { id: invitation.id },
            data: {
                userId: user.id,
                status: 'ACCEPTED',
                acceptedAt: new Date(),
            },
        });

        // Filter questions by role if role is assigned
        const assignedQuestions = invitation.roleId
            ? invitation.assessment.assessmentQuestions.filter(
                (aq) => aq.assignedRoleId === invitation.roleId || !aq.assignedRoleId
            )
            : invitation.assessment.assessmentQuestions;

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                assessment: {
                    id: invitation.assessment.id,
                    projectName: invitation.assessment.project.name,
                    deadline: invitation.assessment.deadline,
                    assignedQuestions,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error accepting invitation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/v1/invitations/[token]
 * 
 * Get invitation details (for preview before accepting)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token;

        const invitation = await prisma.assessmentInvitation.findUnique({
            where: { token },
            include: {
                assessment: {
                    include: {
                        project: {
                            select: {
                                name: true,
                                description: true,
                            },
                        },
                    },
                },
                role: true,
            },
        });

        if (!invitation) {
            return NextResponse.json(
                { error: 'Invalid invitation token' },
                { status: 404 }
            );
        }

        // Check if expired
        if (new Date() > invitation.expiresAt) {
            return NextResponse.json(
                { error: 'Invitation has expired' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                invitation: {
                    email: invitation.email,
                    name: invitation.name,
                    role: invitation.role,
                    seniority: invitation.seniority,
                    notes: invitation.notes,
                    expiresAt: invitation.expiresAt,
                    status: invitation.status,
                    project: invitation.assessment.project,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching invitation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
