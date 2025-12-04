import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services/evidence/evidence.service';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        try {
            const evidence = await evidenceService.getEvidenceForUser(
                id,
                session.user.id,
                session.user.role
            );

            if (!evidence) {
                return NextResponse.json(
                    { error: 'Evidence not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(evidence);
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Failed to get evidence', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
