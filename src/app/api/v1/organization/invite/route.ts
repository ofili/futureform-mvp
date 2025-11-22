import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/services/emailService';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check permissions: Only ORG_ADMIN (OrganizationRole.ADMIN), ADMIN, or OWNER can invite
        const isGlobalAdmin = session.user.role === 'ADMIN';
        const isOrgAdmin = ['ADMIN', 'OWNER'].includes(session.user.organizationRole || '');

        if (!isGlobalAdmin && !isOrgAdmin) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const body = await req.json();
        const { emails } = body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: 'Emails are required' }, { status: 400 });
        }

        if (emails.length > 5) {
            return NextResponse.json({ error: 'You can only invite up to 5 members at a time' }, { status: 400 });
        }

        const results = [];

        for (const email of emails) {
            // Check if user already exists in the organization
            const existingMember = await prisma.organizationMember.findFirst({
                where: {
                    organizationId: session.user.organizationId,
                    user: { email },
                    deletedAt: null
                }
            });

            if (existingMember) {
                results.push({ email, status: 'failed', reason: 'Already a member' });
                continue;
            }

            // Check if invitation already exists
            const existingInvite = await prisma.organizationInvitation.findFirst({
                where: {
                    organizationId: session.user.organizationId,
                    email,
                    status: 'PENDING'
                }
            });

            if (existingInvite) {
                // Resend invite logic could go here, for now just skip
                results.push({ email, status: 'failed', reason: 'Invitation already pending' });
                continue;
            }

            // Create invitation
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

            await prisma.organizationInvitation.create({
                data: {
                    organizationId: session.user.organizationId,
                    email,
                    invitedBy: session.user.id,
                    token,
                    expiresAt,
                    role: 'MEMBER' // Default role
                }
            });

            // Send email
            const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/join?token=${token}`;

            await sendEmail({
                to: email,
                subject: 'You have been invited to join FutureForm',
                html: `
                    <h2>Join FutureForm</h2>
                    <p>You have been invited to join the organization on FutureForm.</p>
                    <p>Click the link below to accept the invitation and create your account:</p>
                    <a href="${joinUrl}">${joinUrl}</a>
                    <p>This link will expire in 7 days.</p>
                `
            });

            results.push({ email, status: 'success' });
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Invite error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
