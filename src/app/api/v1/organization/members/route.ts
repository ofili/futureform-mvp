import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { organizationService } from '@/services/organizations/organization.service';
import { logger } from '@/lib/logger';
import { OrganizationRole } from '@prisma/client';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId || !session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            const members = await organizationService.getMembers(
                session.user.organizationId,
                session.user.id
            );

            const formattedMembers = members.map(m => ({
                id: m.userId,
                memberId: m.id,
                name: `${m.user.firstName} ${m.user.lastName}`,
                email: m.user.email,
                role: m.role,
                jobTitle: m.user.jobTitle,
                department: m.user.department,
                joinedAt: m.joinedAt
            }));

            return NextResponse.json(formattedMembers);
        } catch (error: any) {
            if (error.message.includes('Forbidden') || error.message.includes('Unauthorized')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Get members error', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId || !session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
        }

        try {
            await organizationService.updateMemberRole(
                session.user.organizationId,
                userId,
                role as OrganizationRole,
                session.user.id
            );

            return NextResponse.json({ success: true });
        } catch (error: any) {
            if (error.message.includes('Admin access required')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Update member error', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId || !session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        if (userId === session.user.id) {
            return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
        }

        try {
            await organizationService.removeMember(
                session.user.organizationId,
                userId,
                session.user.id
            );

            return NextResponse.json({ success: true });
        } catch (error: any) {
            if (error.message.includes('Admin access required') || error.message.includes('last admin')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Remove member error', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
