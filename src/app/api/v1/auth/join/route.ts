
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { organizationService } from '@/services/organizations/organization.service';

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

        try {
            const user = await organizationService.acceptInvitation({
                token,
                password,
                firstName,
                lastName,
                jobTitle,
                department
            });

            return NextResponse.json({ success: true, email: user.email });
        } catch (error: any) {
            if (error.message === 'INVALID_INVITATION') {
                return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
            }
            if (error.message === 'INVITATION_EXPIRED') {
                return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
            }
            if (error.message === 'ALREADY_ACCEPTED') {
                return NextResponse.json({ error: 'Invitation is no longer valid' }, { status: 400 });
            }
            throw error;
        }

    } catch (error) {
        console.error('Join error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
