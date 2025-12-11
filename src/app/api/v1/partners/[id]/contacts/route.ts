import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PartnerService } from '@/services/partners/partner.service';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const createContactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    role: z.string().optional(),
});

// POST /api/v1/partners/[id]/contacts - Add contact to partner
export async function POST(
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

        // Instantiate service directly to avoid export issues
        const service = new PartnerService();

        const validation = createContactSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        // Verify access to the partner alias's organization
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
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const contact = await service.addPartnerContact(partnerAliasId, validation.data);

        return NextResponse.json(contact);
    } catch (error) {
        logger.error('Error creating partner contact', error as Error, { service: 'PartnerAPI', method: 'addContact' });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
