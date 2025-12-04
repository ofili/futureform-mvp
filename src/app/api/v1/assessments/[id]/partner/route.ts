import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { partnerService } from '@/services/partners/partner.service';
import { logger } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: assessmentId } = await params;

        try {
            const partner = await partnerService.getPartnerForAssessment(assessmentId, session.user.id);
            return NextResponse.json(partner);
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error fetching partner for assessment', error as Error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
