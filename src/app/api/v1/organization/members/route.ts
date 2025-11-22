import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const members = await prisma.organizationMember.findMany({
            where: {
                organizationId: session.user.organizationId,
                deletedAt: null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        jobTitle: true,
                        department: true
                    }
                }
            }
        });

        const formattedMembers = members.map(m => ({
            id: m.user.id, // Use user ID for easier management
            memberId: m.id,
            name: `${m.user.firstName} ${m.user.lastName}`,
            email: m.user.email,
            role: m.role, // Using Organization Role
            jobTitle: m.user.jobTitle,
            department: m.user.department,
            joinedAt: m.joinedAt
        }));

        return NextResponse.json(formattedMembers);
    } catch (error) {
        console.error('Get members error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only ORG_ADMIN (OrganizationRole.ADMIN) or OWNER or Global ADMIN can update roles
        const isGlobalAdmin = session.user.role === 'ADMIN';
        const isOrgAdmin = ['ADMIN', 'OWNER'].includes(session.user.organizationRole || '');

        if (!isGlobalAdmin && !isOrgAdmin) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
        }

        // Update OrganizationMember role
        await prisma.organizationMember.update({
            where: {
                userId_organizationId: {
                    userId: userId,
                    organizationId: session.user.organizationId
                }
            },
            data: { role }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update member error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only ORG_ADMIN (OrganizationRole.ADMIN) or OWNER or Global ADMIN can remove members
        const isGlobalAdmin = session.user.role === 'ADMIN';
        const isOrgAdmin = ['ADMIN', 'OWNER'].includes(session.user.organizationRole || '');

        if (!isGlobalAdmin && !isOrgAdmin) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        if (userId === session.user.id) {
            return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
        }

        // Soft delete OrganizationMember
        await prisma.organizationMember.updateMany({
            where: {
                organizationId: session.user.organizationId,
                userId: userId
            },
            data: {
                deletedAt: new Date()
            }
        });

        // Optionally disable user login or remove from organization context in User model
        // For now, soft delete in OrganizationMember effectively removes them from the list
        // But they might still be able to login if we don't check deletedAt in auth.
        // Let's also update the User to have no organization? Or just rely on the member check.
        // The auth logic checks `user.organizations`. We should check `deletedAt` there too.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Remove member error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
