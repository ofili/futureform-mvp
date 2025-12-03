import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delegate to service layer
    const stats = await dashboardService.getStats(session.user.id);

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Dashboard stats error', error as Error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}