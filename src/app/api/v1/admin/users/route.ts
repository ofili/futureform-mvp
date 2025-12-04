import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminService } from '@/services/admin/admin.service';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !adminService.verifyAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') || undefined;

    const users = await adminService.listUsersWithFilters(session.user.id, search, role);

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    logger.error('Get users error', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}