import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { partnerService } from '@/services/partners/partner.service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const searchSchema = z.object({
    query: z.string().min(2),
    sector: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = searchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        const matches = await partnerService.searchPartners(validation.data);

        return NextResponse.json({ matches });

    } catch (error) {
        logger.error('Error searching partners', error as Error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
