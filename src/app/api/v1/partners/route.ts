import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { partnerService } from '@/services/partners/partner.service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// Schema for creating a partner
const createPartnerSchema = z.object({
    legalName: z.string().min(2),
    rcNumber: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    sector: z.string().optional(),
    country: z.string().optional(),
    // Organization specific contact
    adminName: z.string().optional(),
    adminEmail: z.string().email().optional().or(z.literal('')),
    // If linking to an existing global partner
    partnerGlobalId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organizationId = await partnerService.getUserOrganizationId(session.user.id);

        if (!organizationId) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const partners = await partnerService.listOrganizationPartners(organizationId);

        return NextResponse.json({ partners });
    } catch (error) {
        logger.error('Error fetching partners', error as Error, { service: 'PartnerAPI', method: 'listPartners' });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organizationId = await partnerService.getUserOrganizationId(session.user.id);

        if (!organizationId) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const body = await req.json();
        const validation = createPartnerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        const result = await partnerService.createPartnerAlias(validation.data, organizationId);

        if (!result.isNew) {
            return NextResponse.json({
                message: result.message,
                partner: result.partner
            }, { status: 200 });
        }

        return NextResponse.json({ partner: result.partner }, { status: 201 });

    } catch (error) {
        logger.error('Error creating partner', error as Error, { service: 'PartnerAPI', method: 'createPartner' });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
