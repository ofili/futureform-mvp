import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { partnerService } from '@/services/partners/partner.service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const verifyCACSchema = z.object({
    rcNumber: z.string().optional(),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: partnerId } = await params;
        const body = await request.json();
        const validation = verifyCACSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        try {
            const partner = await partnerService.verifyCACDetails(
                partnerId,
                session.user.id,
                validation.data.rcNumber
            );
            return NextResponse.json(partner);
        } catch (error: any) {
            if (error.message.includes('not configured')) {
                return NextResponse.json({ error: error.message }, { status: 503 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message.includes('required')) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            if (error.message.includes('CAC')) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error verifying CAC details', error as Error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
