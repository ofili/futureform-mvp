import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { packageService } from '@/services/credits/package.service';
import { logger } from '@/lib/logger';
import { PackageType } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const type = req.nextUrl.searchParams.get('type') as PackageType | undefined;

        const packages = await packageService.getAvailablePackages(type);

        return NextResponse.json(packages);
    } catch (error) {
        logger.error('Failed to get credit packages', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
