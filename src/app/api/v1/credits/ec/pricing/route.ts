import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ecService } from '@/services/credits/ec.service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pricing = await ecService.getECPricing();

        return NextResponse.json(pricing);
    } catch (error) {
        logger.error('Failed to get EC pricing', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
