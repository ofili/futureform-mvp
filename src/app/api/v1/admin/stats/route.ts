import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/services/admin/admin.service';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !adminService.verifyAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await adminService.getSystemStats(session.user.id);

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Get admin stats error', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}