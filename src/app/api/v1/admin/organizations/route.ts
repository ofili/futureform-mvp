import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/services/admin/admin.service';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || !adminService.verifyAdminRole(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || undefined;
        const tier = searchParams.get('tier') || undefined;
        const stage = searchParams.get('stage') || undefined;

        const organizations = await adminService.listOrganizationsDetailed(
            session.user.id,
            search,
            tier,
            stage
        );

        return NextResponse.json(organizations);
    } catch (error) {
        logger.error('Get organizations error', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || !adminService.verifyAdminRole(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
        }

        try {
            const organization = await adminService.updateOrganization(session.user.id, id, data);
            return NextResponse.json(organization);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Update organization error', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
