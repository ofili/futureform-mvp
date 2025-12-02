import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services';
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

        // Authorization check - ensure user has access to this evidence
        // Get user's organization memberships
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId: session.user.id },
            select: { organizationId: true, role: true }
        });

        const userOrgIds = userOrgs.map(org => org.organizationId);

        // Check if uploader belongs to any of user's organizations
        const uploaderOrgs = await prisma.organizationMember.findMany({
            where: {
                userId: evidence.uploadedBy,
                organizationId: { in: userOrgIds }
            }
        });

        // Check if user is admin or has verifier role in any org
        const isAdmin = session.user.role === 'ADMIN';
        const isVerifier = userOrgs.some(org =>
            ['ADMIN', 'ANALYST'].includes(org.role)
        );

        // User has access if:
        // 1. They are a platform admin
        // 2. They are a verifier/analyst
        // 3. The evidence uploader is in the same organization
        const hasAccess = isAdmin || isVerifier || uploaderOrgs.length > 0;

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Forbidden - You do not have access to this evidence' },
                { status: 403 }
            );
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
