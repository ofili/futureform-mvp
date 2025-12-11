import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
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

        // Verify Assessment exists and get its Partner Type
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            select: {
                id: true,
                trustPartnerTypeId: true,
                trustPartnerType: { select: { name: true } }
            }
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        if (!assessment.trustPartnerTypeId) {
            // Fallback for non-Trust assessments or if template didn't set it (less likely now)
            return NextResponse.json({ roles: [] });
        }

        // Fetch Required Roles for this Partner Type
        const roles = await prisma.trustRequiredRole.findMany({
            where: { partnerTypeId: assessment.trustPartnerTypeId },
            // Ordering: Critical first, then High, Median, Low
            // Prisma doesn't sort by custom enum order easily, so we sort in JS
        });

        const criticalityOrder: Record<string, number> = {
            'CRITICAL': 0,
            'HIGH': 1,
            'MEDIUM': 2,
            'LOW': 3
        };

        const sortedRoles = roles.sort((a, b) => {
            const scoreA = criticalityOrder[a.criticality] ?? 99;
            const scoreB = criticalityOrder[b.criticality] ?? 99;
            return scoreA - scoreB;
        });

        return NextResponse.json({
            partnerTypeName: assessment.trustPartnerType?.name,
            roles: sortedRoles
        });

    } catch (error) {
        logger.error('Error fetching partner roles', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
