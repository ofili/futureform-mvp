import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services/evidence/evidence.service';
import { logger } from '@/lib/logger';
import { VerificationStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has VERIFIER role (ADMIN or ANALYST in any organization)
        const isAdmin = session.user.role === 'ADMIN';

        if (!isAdmin) {
            const userOrgs = await prisma.organizationMember.findMany({
                where: {
                    userId: session.user.id,
                    deletedAt: null,
                    role: { in: ['ADMIN', 'ANALYST'] }
                },
                select: { role: true }
            });

            if (userOrgs.length === 0) {
                return NextResponse.json(
                    { error: 'Forbidden: Only admins and analysts can validate evidence' },
                    { status: 403 }
                );
            }
        }

        const body = await req.json();
        const { status, notes } = body;

        if (!status || !Object.values(VerificationStatus).includes(status)) {
            return NextResponse.json(
                { error: 'Valid verification status is required' },
                { status: 400 }
            );
        }

        const { id } = await params;
        const evidence = await evidenceService.validateEvidence({
            evidenceId: id,
            status: status as VerificationStatus,
            verifiedBy: session.user.id,
            notes,
        });

        return NextResponse.json(evidence);
    } catch (error) {
        logger.error('Failed to validate evidence', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
