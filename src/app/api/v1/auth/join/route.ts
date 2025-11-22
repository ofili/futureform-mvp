import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const invitation = await prisma.organizationInvitation.findUnique({
            where: { token },
            include: { organization: true }
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
        }

        if (invitation.status !== 'PENDING') {
            return NextResponse.json({ error: 'Invitation is no longer valid' }, { status: 400 });
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
        }

        return NextResponse.json({
            email: invitation.email,
            organizationName: invitation.organization.name
        });
    } catch (error) {
        console.error('Validate token error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, firstName, lastName, password, jobTitle, department } = body;

        if (!token || !firstName || !lastName || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Validate token
        const invitation = await prisma.organizationInvitation.findUnique({
            where: { token },
            include: { organization: true }
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
        }

        if (invitation.status !== 'PENDING') {
            return NextResponse.json({ error: 'Invitation is no longer valid' }, { status: 400 });
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
        }

        // Create User
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email: invitation.email,
                password: hashedPassword,
                firstName,
                lastName,
                jobTitle,
                department,
                role: 'USER', // Default role, admin can upgrade later
                organizations: {
                    create: {
                        organizationId: invitation.organizationId,
                        role: invitation.role
                    }
                }
            }
        });

        // Update invitation status
        await prisma.organizationInvitation.update({
            where: { id: invitation.id },
            data: {
                status: 'ACCEPTED',
                acceptedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, email: user.email });
    } catch (error) {
        console.error('Join error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
