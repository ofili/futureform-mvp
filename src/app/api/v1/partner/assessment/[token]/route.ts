import { NextRequest, NextResponse } from 'next/server';
import { partnerService } from '@/services/partners/partner.service';
import { logger } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        try {
            const response = await partnerService.getAssessmentByToken(token);
            return NextResponse.json(response);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            if (error.message.includes('expired')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 410 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error fetching partner assessment', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
