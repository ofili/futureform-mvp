import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminService } from '@/services/admin/admin.service';
import { logger } from '@/lib/logger';

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || !adminService.verifyAdminRole(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { role } = await req.json();

        if (!role) {
            return NextResponse.json(
                { error: 'Role is required' },
                { status: 400 }
            );
        }

        try {
            const updatedUser = await adminService.updateUserRoleValidated(
                session.user.id,
                params.id,
                role
            );

            return NextResponse.json({ data: updatedUser });
        } catch (error: any) {
            if (error.message.includes('Invalid role')) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error updating user', error as Error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
