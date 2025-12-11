import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: assessmentId } = await params;
        const body = await request.json();
        const { partners } = body;

        if (!partners || !Array.isArray(partners) || partners.length === 0) {
            return NextResponse.json({ error: 'No partners provided' }, { status: 400 });
        }

        // Verify Assessment exists and user has access
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: {
                    include: {
                        organization: true
                    }
                }
            }
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        const organizationId = assessment.project.organizationId;

        const createdPartners = [];
        const errors = [];

        for (const p of partners) {
            try {
                // Generate secure token
                const token = crypto.randomBytes(32).toString('hex');

                let partnerAliasId = p.partnerAliasId;
                let partnerGlobalId = p.partnerGlobalId;

                // If no partnerAliasId, we need to create one
                if (!partnerAliasId && organizationId) {
                    // First, check or create global partner
                    if (!partnerGlobalId) {
                        // Create a new global partner
                        const newPartner = await prisma.partner.create({
                            data: {
                                legalName: p.partnerName,
                                verification: 'UNVERIFIED',
                            }
                        });
                        partnerGlobalId = newPartner.id;

                        // Also save the admin contact
                        if (p.adminEmail || p.adminName) {
                            await prisma.partnerContact.create({
                                data: {
                                    partnerId: partnerGlobalId,
                                    name: p.adminName,
                                    email: p.adminEmail,
                                }
                            });
                        }
                    }

                    // Check if alias already exists for this org
                    const existingAlias = await prisma.partnerAlias.findFirst({
                        where: {
                            partnerId: partnerGlobalId,
                            organizationId: organizationId,
                        }
                    });

                    if (existingAlias) {
                        partnerAliasId = existingAlias.id;
                    } else {
                        // Create new alias
                        const newAlias = await prisma.partnerAlias.create({
                            data: {
                                partnerId: partnerGlobalId,
                                organizationId: organizationId,
                                displayName: p.partnerName,
                                relationshipStatus: 'Pending',
                                visibility: true,
                            }
                        });
                        partnerAliasId = newAlias.id;
                        logger.info(`Created new PartnerAlias: ${partnerAliasId} for partner ${p.partnerName}`);
                    }
                }

                const assessmentPartner = await prisma.assessmentPartner.create({
                    data: {
                        assessmentId,
                        partnerId: partnerGlobalId,
                        partnerAliasId: partnerAliasId || null,
                        adminName: p.adminName,
                        adminEmail: p.adminEmail,
                        invitationToken: token,
                        invitationStatus: 'PENDING',
                        status: 'ACTIVE'
                    }
                });

                // Send Invitation Email
                logger.info(`AssessmentPartner created: ${assessmentPartner.id}. Token: ${token}`);

                createdPartners.push(assessmentPartner);

            } catch (err: any) {
                logger.error(`Failed to invite partner ${p.partnerName}`, err);
                errors.push({ partner: p.partnerName, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            invited: createdPartners.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        logger.error('Error in inviting partners', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
