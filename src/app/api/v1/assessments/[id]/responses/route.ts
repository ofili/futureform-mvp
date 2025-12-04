import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { assessmentService } from '@/services/assessments/assessment.service';
import { logger } from '@/lib/logger';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 });
        }

        try {
            await assessmentService.submitResponses(id, session.user.id, responses);
            return NextResponse.json({ success: true });
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            if (error.message.includes('Assessment not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Submit responses error', error as Error);
        return NextResponse.json({ error: 'Failed to submit responses' }, { status: 500 });
    }
}
