import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { role } = await req.json();

        if (!role) {
            return NextResponse.json(
                { error: 'Role is required' },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['ADMIN', 'USER'];
        if (!validRoles.includes(role.toUpperCase())) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { role: role.toUpperCase() },
            include: {
                organizations: {
                    where: { deletedAt: null },
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ data: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
