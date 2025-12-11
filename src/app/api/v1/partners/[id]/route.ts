import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// GET /api/v1/partners/[id] - Get partner details with all related data
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: partnerAliasId } = await params;

        // Fetch partner alias with all related data
        const partnerAlias = await prisma.partnerAlias.findUnique({
            where: { id: partnerAliasId },
            include: {
                partner: {
                    include: {
                        partnerContacts: {
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                },
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
                assessmentPartners: {
                    include: {
                        assessment: {
                            include: {
                                project: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                scores: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!partnerAlias) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        // Check user has access
        if (partnerAlias.organization.members.length === 0) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Transform assessments for response
        const assessments = partnerAlias.assessmentPartners.map((ap) => ({
            id: ap.assessment.id,
            projectName: ap.assessment.project.name,
            projectId: ap.assessment.project.id,
            status: ap.assessment.status,
            invitationStatus: ap.invitationStatus,
            createdAt: ap.createdAt,
            completedAt: ap.assessment.completedAt,
            score: ap.assessment.overallScore ?? null,
        }));

        // Calculate aggregate rating from assessments
        const completedAssessments = assessments.filter((a) => a.score !== null);
        const averageScore = completedAssessments.length > 0
            ? completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length
            : null;

        return NextResponse.json({
            id: partnerAlias.id,
            displayName: partnerAlias.displayName,
            relationshipStatus: partnerAlias.relationshipStatus,
            internalNotes: partnerAlias.internalNotes,
            cachedSector: partnerAlias.cachedSector,
            cachedCountry: partnerAlias.cachedCountry,
            cachedWebsite: partnerAlias.cachedWebsite,
            createdAt: partnerAlias.createdAt,
            partner: {
                id: partnerAlias.partner.id,
                legalName: partnerAlias.partner.legalName,
                website: partnerAlias.partner.website,
                sector: partnerAlias.partner.sector,
                country: partnerAlias.partner.country,
                verification: partnerAlias.partner.verification,
                rcNumber: partnerAlias.partner.rcNumber,
                cacNumber: partnerAlias.partner.cacNumber,
                cacVerifiedName: partnerAlias.partner.cacVerifiedName,
                cacVerifiedAt: partnerAlias.partner.cacVerifiedAt,
                cacVerificationData: partnerAlias.partner.cacVerificationData,
                registeredAddress: partnerAlias.partner.registeredAddress,
                incorporationDate: partnerAlias.partner.incorporationDate,
                companyType: partnerAlias.partner.companyType,
                directors: partnerAlias.partner.directors,
                aggregateScore: partnerAlias.partner.aggregateScore,
            },
            contacts: partnerAlias.partner.partnerContacts.map((c) => ({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                role: c.role,
            })),
            assessments,
            stats: {
                totalAssessments: assessments.length,
                completedAssessments: completedAssessments.length,
                averageScore,
                mostRecentScore: assessments[0]?.score || null,
            },
        });
    } catch (error) {
        logger.error('Error fetching partner details', error as Error, { service: 'PartnerAPI', method: 'getPartner' });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

const updatePartnerSchema = z.object({
    displayName: z.string().optional(),
    internalNotes: z.string().optional(),
    relationshipStatus: z.string().optional(),
});

// PATCH /api/v1/partners/[id] - Update partner alias
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

        const validation = updatePartnerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        // Verify access
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

        const updated = await prisma.partnerAlias.update({
            where: { id: partnerAliasId },
            data: validation.data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        logger.error('Error updating partner', error as Error, { service: 'PartnerAPI', method: 'updatePartner' });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
