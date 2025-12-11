import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const updateStatusSchema = z.object({
    relationshipStatus: z.enum(['Active', 'Pending', 'Blocked', 'Past']),
});

// PATCH /api/v1/partners/[id]/status - Update partner alias status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: partnerAliasId } = await params;
        const body = await request.json();

        const validation = updateStatusSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        // Verify user has access to this partner alias (via organization membership)
        const partnerAlias = await prisma.partnerAlias.findUnique({
            where: { id: partnerAliasId },
            include: {
                organization: {
                    include: {
                        members: {
                            where: {
                                userId: session.user.id,
                                deletedAt: null,
                            },
                        },
                    },
                },
            },
        });

        if (!partnerAlias) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        if (partnerAlias.organization.members.length === 0) {
            return NextResponse.json({ error: 'Forbidden: No access to this partner' }, { status: 403 });
        }

        // Update the partner alias status
        const updated = await prisma.partnerAlias.update({
            where: { id: partnerAliasId },
            data: {
                relationshipStatus: validation.data.relationshipStatus,
            },
            include: {
                partner: {
                    select: {
                        id: true,
                        legalName: true,
                        website: true,
                        sector: true,
                        country: true,
                        verification: true,
                    },
                },
            },
        });

        logger.info('Partner status updated', {
            service: 'PartnerAPI',
            method: 'updateStatus',
            partnerAliasId,
            newStatus: validation.data.relationshipStatus,
            userId: session.user.id,
        });

        return NextResponse.json(updated);
    } catch (error) {
        logger.error('Error updating partner status', error as Error, { service: 'PartnerAPI', method: 'updateStatus' });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
