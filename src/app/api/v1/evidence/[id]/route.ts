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
        const evidence = await evidenceService.getEvidenceById(id);

        if (!evidence) {
            return NextResponse.json(
                { error: 'Evidence not found' },
                { status: 404 }
            );
        }

        // Authorization check: user must be admin, verifier, or belong to evidence owner's org
        const isAdmin = session.user.role === 'ADMIN';

        if (!isAdmin) {
            // Check if user belongs to same organization as evidence uploader
            const userOrgs = await prisma.organizationMember.findMany({
                where: { userId: session.user.id, deletedAt: null },
                select: { organizationId: true, role: true }
            });

            const uploaderOrgs = await prisma.organizationMember.findMany({
                where: { userId: evidence.uploadedBy, deletedAt: null },
                select: { organizationId: true }
            });

            const hasOrgAccess = userOrgs.some(userOrg =>
                uploaderOrgs.some(uploaderOrg => uploaderOrg.organizationId === userOrg.organizationId)
            );

            const isVerifier = userOrgs.some(org =>
                ['ADMIN', 'ANALYST'].includes(org.role)
            );

            if (!hasOrgAccess && !isVerifier) {
                return NextResponse.json(
                    { error: 'Forbidden: You do not have access to this evidence' },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json(evidence);
    } catch (error) {
        logger.error('Failed to get evidence', error as Error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
