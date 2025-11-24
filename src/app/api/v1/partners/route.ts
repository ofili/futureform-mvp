import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for creating a partner
const createPartnerSchema = z.object({
    legalName: z.string().min(2),
    website: z.string().url().optional().or(z.literal('')),
    sector: z.string().optional(),
    country: z.string().optional(),
    // If linking to an existing global partner
    partnerGlobalId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's organization (assuming single org for now or context header)
        // For MVP, we'll fetch the first organization the user is a member of
        // In a real multi-tenant setup, this should come from a header or session context
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                organizations: {
                    take: 1,
                    select: { organizationId: true }
                }
            }
        });

        const organizationId = user?.organizations[0]?.organizationId;

        if (!organizationId) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Fetch partners for this organization (via aliases)
        const partners = await prisma.partnerAlias.findMany({
            where: {
                organizationId,
                visibility: true,
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
                    }
                }
            },
            orderBy: {
                displayName: 'asc',
            },
        });

        return NextResponse.json({ partners });
    } catch (error) {
        console.error('Error fetching partners:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                organizations: {
                    take: 1,
                    select: { organizationId: true }
                }
            }
        });

        const organizationId = user?.organizations[0]?.organizationId;

        if (!organizationId) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const body = await req.json();
        const validation = createPartnerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        const { legalName, website, sector, country, partnerGlobalId } = validation.data;

        // 1. Determine the Global Partner ID
        let globalId = partnerGlobalId;

        if (!globalId) {
            // Check if a partner with this name already exists globally (fuzzy match could go here, but strict for now)
            const existingPartner = await prisma.partner.findFirst({
                where: {
                    legalName: { equals: legalName, mode: 'insensitive' }
                }
            });

            if (existingPartner) {
                globalId = existingPartner.id;
            } else {
                // Create new Global Partner
                const newPartner = await prisma.partner.create({
                    data: {
                        legalName,
                        website,
                        sector,
                        country,
                        createdByOrgId: organizationId,
                        verification: 'UNVERIFIED',
                    }
                });
                globalId = newPartner.id;
            }
        }

        // 2. Create Partner Alias for this Organization
        // Check if alias already exists
        const existingAlias = await prisma.partnerAlias.findUnique({
            where: {
                partnerId_organizationId: {
                    partnerId: globalId,
                    organizationId,
                }
            }
        });

        if (existingAlias) {
            return NextResponse.json({
                message: 'Partner already exists in your organization',
                partner: existingAlias
            }, { status: 200 });
        }

        const newAlias = await prisma.partnerAlias.create({
            data: {
                partnerId: globalId,
                organizationId,
                displayName: legalName, // Default to legal name
                cachedWebsite: website,
                cachedSector: sector,
                cachedCountry: country,
                relationshipStatus: 'Active',
            }
        });

        // Increment usage count on global partner
        await prisma.partner.update({
            where: { id: globalId },
            data: { usageCount: { increment: 1 } }
        });

        return NextResponse.json({ partner: newAlias }, { status: 201 });

    } catch (error) {
        console.error('Error creating partner:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
