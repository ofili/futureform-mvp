import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const { id: projectId } = await params;
        const body = await request.json();
        const { token: invitationToken } = body;

        if (!invitationToken) {
            return NextResponse.json({ message: 'Invitation token is required' }, { status: 400 });
        }

        // Find pending invitation
        const invitation = await prisma.projectTeamMember.findFirst({
            where: {
                projectId,
                invitationToken,
                invitationStatus: 'PENDING',
            },
        });

        if (!invitation) {
            return NextResponse.json({ message: 'Invitation not found or already accepted' }, { status: 404 });
        }

        // Accept invitation
        const updated = await prisma.projectTeamMember.update({
            where: { id: invitation.id },
            data: {
                userId,
                invitationStatus: 'ACCEPTED',
                invitationAcceptedAt: new Date(),
            },
        });

        return NextResponse.json({ message: 'Invitation accepted', teamMember: updated });
    } catch (error: any) {
        console.error('accept-invite error', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
