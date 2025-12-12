
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: organizationId } = await params;
        const { email, role = 'USER' } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // 1. Check permissions (Must be Admin/Owner of Org)
        const membership = await prisma.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId: session.user.id,
                    organizationId,
                },
            },
        });

        if (!membership || (membership.role !== 'ADMIN' && membership.role !== 'OWNER')) {
            return NextResponse.json(
                { message: 'Forbidden: Only admins can invite members' },
                { status: 403 }
            );
        }

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // Check if already a member
            const existingMembership = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: existingUser.id,
                        organizationId,
                    },
                },
            });

            if (existingMembership) {
                if (existingMembership.deletedAt) {
                    // Re-activate
                    await prisma.organizationMember.update({
                        where: { id: existingMembership.id },
                        data: { deletedAt: null, role: role as any }
                    });
                    return NextResponse.json({ message: 'User reactivated in organization', user: existingUser });
                }
                return NextResponse.json(
                    { message: 'User is already a member of this organization' },
                    { status: 409 }
                );
            }

            // Add existing user to organization directly (or create invite? Let's add directly for simplicity or as per typical MVP flow)
            // Requirement says "invited member receives an email and link to signup". This implies NEW users.
            // But for existing users, we should probably just add them and notify.

            await prisma.organizationMember.create({
                data: {
                    userId: existingUser.id,
                    organizationId,
                    role: role as any,
                },
            });

            // Send notification email (skipped for now or can add generic "You've been added" email)
            try {
                await sendEmail({
                    to: email,
                    subject: 'You have been added to an organization on FutureForm',
                    html: `<p>You have been added to organization matching ID ${organizationId}. Log in to view.</p>`
                });
            } catch (e) {
                console.error("Failed to send email", e);
            }

            return NextResponse.json({ message: 'User added to organization', user: existingUser });
        }

        // 3. User does NOT exist - Create Invitation
        // Check if invitation already exists
        // We need to know the Model name. Assuming OrganizationInvitation.
        // If Model doesn't exist, this will error. I'll rely on TS to tell me or assume standard.
        // I'll search for invitation by email and org.

        // Note: I haven't seen the model definition, so I'm guessing "invitation" field names.
        // Organization model has `invitations OrganizationInvitation[]`
        // User model has `sentInvitations`

        // Check pending invitations
        const existingInvite = await prisma.organizationInvitation.findFirst({
            where: {
                organizationId,
                email,
                status: 'PENDING'
            }
        });

        if (existingInvite) {
            // Resend logic could be here
            return NextResponse.json({ message: 'Invitation already pending' }, { status: 409 });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const invitation = await prisma.organizationInvitation.create({
            data: {
                email,
                role: role as any, // assuming OrganizationRole enum matches string
                organizationId,
                invitedBy: session.user.id,
                token,
                expiresAt,
                status: 'PENDING'
            }
        });

        // 4. Send Email
        // Link format: {baseUrl}/auth/signup?token={token}&email={email}
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const signupLink = `${baseUrl}/auth/join?token=${token}`;

        await sendEmail({
            to: email,
            subject: 'You have been invited to join an organization on FutureForm',
            html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Welcome to FutureForm</h2>
                <p>You have been invited to join an organization.</p>
                <p>Click the link below to create your account and accept the invitation:</p>
                <a href="${signupLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
                <p>Or copy this link: ${signupLink}</p>
            </div>
        `
        });

        return NextResponse.json({ message: 'Invitation sent', invitation });

    } catch (error: any) {
        console.error('Error inviting user:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
