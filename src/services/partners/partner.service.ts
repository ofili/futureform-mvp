// Partner Service
// Handles partner and partner alias operations

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { PartnerVerification } from '@prisma/client';

export interface CreatePartnerInput {
    legalName: string;
    website?: string;
    sector?: string;
    country?: string;
    partnerGlobalId?: string;
}

export interface SearchPartnerInput {
    query: string;
    sector?: string;
}

export class PartnerService {
    /**
     * Get organization's partners (via aliases)
     */
    async listOrganizationPartners(organizationId: string) {
        logger.info('Listing organization partners', {
            service: 'PartnerService',
            method: 'listOrganizationPartners',
            organizationId,
        });

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

        return partners;
    }

    /**
     * Create or link partner to organization
     */
    async createPartnerAlias(data: CreatePartnerInput, organizationId: string) {
        logger.info('Creating partner alias', {
            service: 'PartnerService',
            method: 'createPartnerAlias',
            organizationId,
            legalName: data.legalName,
        });

        // 1. Determine the Global Partner ID
        let globalId = data.partnerGlobalId;

        if (!globalId) {
            // Check if a partner with this name already exists globally
            const existingPartner = await prisma.partner.findFirst({
                where: {
                    legalName: { equals: data.legalName, mode: 'insensitive' }
                }
            });

            if (existingPartner) {
                globalId = existingPartner.id;
            } else {
                // Create new Global Partner
                const newPartner = await prisma.partner.create({
                    data: {
                        legalName: data.legalName,
                        website: data.website,
                        sector: data.sector,
                        country: data.country,
                        createdByOrgId: organizationId,
                        verification: PartnerVerification.UNVERIFIED,
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
            return {
                message: 'Partner already exists in your organization',
                partner: existingAlias,
                isNew: false
            };
        }

        const newAlias = await prisma.partnerAlias.create({
            data: {
                partnerId: globalId,
                organizationId,
                displayName: data.legalName, // Default to legal name
                cachedWebsite: data.website,
                cachedSector: data.sector,
                cachedCountry: data.country,
                relationshipStatus: 'Active',
            }
        });

        // Increment usage count on global partner
        await prisma.partner.update({
            where: { id: globalId },
            data: { usageCount: { increment: 1 } }
        });

        return {
            partner: newAlias,
            isNew: true
        };
    }

    /**
     * Search global partners
     */
    async searchPartners(data: SearchPartnerInput) {
        logger.info('Searching partners', {
            service: 'PartnerService',
            method: 'searchPartners',
            query: data.query,
        });

        const matches = await prisma.partner.findMany({
            where: {
                OR: [
                    { legalName: { contains: data.query, mode: 'insensitive' } },
                    { website: { contains: data.query, mode: 'insensitive' } },
                ],
                ...(data.sector ? { sector: { equals: data.sector, mode: 'insensitive' } } : {}),
            },
            take: 5,
            select: {
                id: true,
                legalName: true,
                website: true,
                sector: true,
                country: true,
                verification: true,
            }
        });

        return matches;
    }

    /**
     * Get assessment by token (for partner access)
     */
    async getAssessmentByToken(token: string) {
        logger.info('Fetching assessment by token', {
            service: 'PartnerService',
            method: 'getAssessmentByToken',
            token,
        });

        const assessment = await prisma.assessment.findUnique({
            where: { token },
            include: {
                project: {
                    select: {
                        name: true,
                        description: true,
                    }
                },
                partner: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                responses: {
                    select: {
                        id: true,
                        questionId: true,
                        updatedAt: true,
                    }
                },
                assessmentQuestions: {
                    include: {
                        question: true,
                        role: true,
                    }
                }
            }
        });

        if (!assessment) {
            throw new Error('Assessment not found');
        }

        // Check if assessment is expired
        if (assessment.deadline && new Date(assessment.deadline) < new Date()) {
            throw new Error('Assessment has expired');
        }

        // Calculate progress
        const totalQuestions = assessment.assessmentQuestions.length;
        const answeredQuestions = assessment.responses.length;
        const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

        // Get last saved timestamp
        const lastSaved = assessment.responses.length > 0
            ? assessment.responses.reduce((latest, response) =>
                response.updatedAt > latest ? response.updatedAt : latest,
                assessment.responses[0].updatedAt
            )
            : null;

        // Get user role information
        const userRole = assessment.assessmentQuestions[0]?.role;
        const assignedDomains = Array.from(new Set(
            assessment.assessmentQuestions.map(aq => aq.question.domain)
        ));

        return {
            project: {
                name: assessment.project.name,
                description: assessment.project.description || '',
            },
            assessment: {
                id: assessment.id,
                title: `Trust Diagnostic - ${assessment.partnerType}`,
                dueDate: assessment.deadline,
                estimatedDuration: assessment.estimatedDuration || 15,
                status: assessment.status,
            },
            partnerOrg: {
                name: assessment.partnerName,
            },
            userRole: {
                role: userRole?.name || 'Respondent',
                domains: assignedDomains,
                whySelected: `You were selected because your role provides critical expertise required for evaluating ${assignedDomains.join(', ')} in this deployment.`,
            },
            progress: {
                total: totalQuestions,
                answered: answeredQuestions,
                percentage,
                lastSaved,
            },
        };
    }

    /**
     * Get user's organization ID (helper method)
     */
    async getUserOrganizationId(userId: string): Promise<string | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                organizations: {
                    take: 1,
                    where: { deletedAt: null },
                    select: { organizationId: true }
                }
            }
        });

        return user?.organizations[0]?.organizationId || null;
    }

    /**
     * Verify partner CAC details via Mono API
     */
    async verifyCACDetails(partnerId: string, userId: string, rcNumber?: string) {
        logger.info('Verifying partner CAC details', {
            service: 'PartnerService',
            method: 'verifyCACDetails',
            partnerId,
            userId,
        });

        // Import monoService dynamically to avoid circular dependencies
        const { monoService } = await import('@/services/mono/mono.service');

        if (!monoService.isConfigured()) {
            throw new Error('CAC verification service not configured');
        }

        // Get partner
        const partner = await prisma.partner.findUnique({
            where: { id: partnerId },
        });

        if (!partner) {
            throw new Error('Partner not found');
        }

        // Use provided RC number or existing one
        const rcNumberToVerify = rcNumber || partner.rcNumber || partner.cacNumber;

        if (!rcNumberToVerify) {
            throw new Error('RC/CAC number required for verification');
        }

        // Call Mono API
        const cacData = await monoService.lookupCompanyByRC(rcNumberToVerify);

        // Update partner with verification data
        const updatedPartner = await prisma.partner.update({
            where: { id: partnerId },
            data: {
                cacNumber: cacData.rcNumber,
                rcNumber: cacData.rcNumber,
                cacVerifiedName: cacData.companyName,
                cacVerifiedAt: new Date(),
                cacVerificationData: cacData as any,
                directors: cacData.directors as any,
                registeredAddress: cacData.registeredAddress,
                incorporationDate: cacData.incorporationDate ? new Date(cacData.incorporationDate) : null,
                companyType: cacData.companyType,
                verification: 'VERIFIED',
            },
        });

        logger.info('Partner CAC verification completed', {
            service: 'PartnerService',
            method: 'verifyCACDetails',
            partnerId,
            verifiedName: cacData.companyName,
        });

        return updatedPartner;
    }

    /**
     * Get partner for a specific assessment
     */
    async getPartnerForAssessment(assessmentId: string, userId: string) {
        logger.info('Getting partner for assessment', {
            service: 'PartnerService',
            method: 'getPartnerForAssessment',
            assessmentId,
            userId,
        });

        // Get assessment with partner
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                partnerAlias: {
                    include: {
                        partner: true,
                    },
                },
                project: {
                    select: {
                        organizationId: true,
                    },
                },
            },
        });

        if (!assessment) {
            throw new Error('Assessment not found');
        }

        // Check user has access to this assessment's organization
        const userOrg = await prisma.organizationMember.findFirst({
            where: {
                userId,
                organizationId: assessment.project.organizationId,
                deletedAt: null,
            },
        });

        if (!userOrg) {
            throw new Error('Forbidden: No access to this assessment');
        }

        if (!assessment.partnerAlias?.partner) {
            throw new Error('No partner associated with this assessment');
        }

        return assessment.partnerAlias.partner;
    }

    /**
     * Get partner with verification data
     */
    async getPartnerWithVerification(partnerId: string, userId: string) {
        logger.info('Getting partner with verification', {
            service: 'PartnerService',
            method: 'getPartnerWithVerification',
            partnerId,
            userId,
        });

        const partner = await prisma.partner.findUnique({
            where: { id: partnerId },
            include: {
                aliases: {
                    where: {
                        organization: {
                            members: {
                                some: {
                                    userId,
                                    deletedAt: null,
                                },
                            },
                        },
                    },
                    take: 1,
                },
            },
        });

        if (!partner) {
            throw new Error('Partner not found');
        }

        // Check user has access via organization
        if (partner.aliases.length === 0) {
            throw new Error('Forbidden: No access to this partner');
        }

        return partner;
    }
}

// Export singleton instance
export const partnerService = new PartnerService();
