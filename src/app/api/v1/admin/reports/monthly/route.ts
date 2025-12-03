import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/services/admin/admin.service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const now = new Date();
    const month = parseInt(searchParams.get('month') || String(now.getMonth() + 1), 10);
    const year = parseInt(searchParams.get('year') || String(now.getFullYear()), 10);

    // Optional: validate month/year here or let service throw
    // We'll let the service handle validation

    const report = await adminService.getMonthlyReport(session.user.id, month, year);

    return NextResponse.json({ success: true,  report });
  } catch (error: any) {
    console.error('Monthly report route error:', error);

    // Handle known errors gracefully
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error.message?.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to generate monthly report' },
      { status: 500 }
    );
  }
}