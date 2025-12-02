import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ecService } from '@/services';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { organizationId, threshold, reloadAmount, enabled } = body;

        if (!organizationId) {
            return NextResponse.json(
                { error: 'Organization ID is required' },
                { status: 400 }
            );
        }

        if (enabled === false) {
            await ecService.disableAutoReload(organizationId);
            return NextResponse.json({ success: true, message: 'Auto-reload disabled' });
        }

        if (!threshold || !reloadAmount) {
            return NextResponse.json(
                { error: 'Threshold and reload amount are required to enable auto-reload' },
                { status: 400 }
            );
        }

        await ecService.setupAutoReload(organizationId, threshold, reloadAmount);

        return NextResponse.json({ success: true, message: 'Auto-reload configured' });
    } catch (error) {
        logger.error('Failed to setup EC auto-reload', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
