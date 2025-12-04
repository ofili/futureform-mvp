// Evidence Service
// Handles submission, validation, and retrieval of evidence (AE, VE, DSE)

import prisma from '@/lib/prisma';
import { EvidenceValidationError } from '@/lib/errors/credit-errors';
import { logger } from '@/lib/logger';
import { ecService } from '../credits/ec.service';
import { EvidenceLayer, VerificationStatus, Prisma } from '@prisma/client';

export interface EvidenceSubmission {
    layer: EvidenceLayer;
    type: string;
    category?: string;
    fileName?: string;
    fileUrl?: string;
    fileType?: string;
    fileSize?: number;
    dataPayload?: any;
    metadata?: any;
    responseId?: string;
    uploadedBy: string;
}

export interface EvidenceValidation {
    evidenceId: string;
    status: VerificationStatus;
    verifiedBy: string;
    notes?: string;
}

export class EvidenceService {
    /**
     * Submit evidence (AE, VE, or DSE)
     * Automatically consumes EC credits based on evidence type
     */
    async submitEvidence(
        organizationId: string,
        submission: EvidenceSubmission
    ) {
        logger.info('Submitting evidence', {
            service: 'EvidenceService',
            method: 'submitEvidence',
            organizationId,
            layer: submission.layer,
            type: submission.type,
        });

        // 1. Validate submission payload
        this.validateSubmission(submission);

        // 2. Calculate EC cost
        const ecCost = await ecService.calculateECCost(submission.type);

        // 3. Process submission and credit consumption in a transaction
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create evidence record
            const evidence = await tx.enhancedEvidence.create({
                data: {
                    layer: submission.layer,
                    type: submission.type,
                    category: submission.category,
                    fileName: submission.fileName,
                    fileUrl: submission.fileUrl,
                    fileType: submission.fileType,
                    fileSize: submission.fileSize,
                    dataPayload: submission.dataPayload,
                    metadata: submission.metadata,
                    responseId: submission.responseId,
                    uploadedBy: submission.uploadedBy,
                    verificationStatus: VerificationStatus.PENDING,
                    ecCost: ecCost,
                },
            });

            // Consume EC credits if cost > 0
            if (ecCost > 0) {
                await ecService.consumeEC(
                    organizationId,
                    submission.type,
                    evidence.id,
                    undefined, // assessmentId
                    `Evidence submission: ${submission.type}`,
                    tx // Pass the transaction client
                );
            }

            return evidence;
        });
    }

    /**
     * Submit Assessment Evidence (AE)
     */
    async submitAE(organizationId: string, submission: Omit<EvidenceSubmission, 'layer'>) {
        return this.submitEvidence(organizationId, { ...submission, layer: EvidenceLayer.AE });
    }

    /**
     * Submit Verification Evidence (VE)
     */
    async submitVE(organizationId: string, submission: Omit<EvidenceSubmission, 'layer'>) {
        return this.submitEvidence(organizationId, { ...submission, layer: EvidenceLayer.VE });
    }

    /**
     * Submit Digital Signal Evidence (DSE)
     */
    async submitDSE(organizationId: string, submission: Omit<EvidenceSubmission, 'layer'>) {
        return this.submitEvidence(organizationId, { ...submission, layer: EvidenceLayer.DSE });
    }

    /**
     * Validate evidence
     */
    async validateEvidence(validation: EvidenceValidation) {
        logger.info('Validating evidence', {
            service: 'EvidenceService',
            method: 'validateEvidence',
            evidenceId: validation.evidenceId,
            status: validation.status,
        });

        const evidence = await prisma.enhancedEvidence.findUnique({
            where: { id: validation.evidenceId },
        });

        if (!evidence) {
            throw new Error('Evidence not found');
        }

        return await prisma.enhancedEvidence.update({
            where: { id: validation.evidenceId },
            data: {
                verificationStatus: validation.status,
                verifiedBy: validation.verifiedBy,
                verifiedAt: new Date(),
                verificationNotes: validation.notes,
            },
        });
    }

    /**
     * Get evidence by ID
     */
    async getEvidenceById(id: string) {
        return await prisma.enhancedEvidence.findUnique({
            where: { id },
            include: {
                uploader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                verifier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                ecTransactions: true,
            },
        });
    }

    /**
     * Validate submission payload
     */
    private validateSubmission(submission: EvidenceSubmission) {
        const errors: string[] = [];

        if (!submission.type) {
            errors.push('Evidence type is required');
        }

        if (!submission.uploadedBy) {
            errors.push('Uploader ID is required');
        }

        if (submission.layer === EvidenceLayer.DSE && !submission.dataPayload) {
            errors.push('Data payload is required for DSE');
        }

        if (errors.length > 0) {
            throw new EvidenceValidationError('Invalid evidence submission', errors);
        }
    }

    /**
     * Get evidence with authorization check
     */
    async getEvidenceForUser(evidenceId: string, userId: string, userRole: string) {
        const evidence = await this.getEvidenceById(evidenceId);
        if (!evidence) {
            return null;
        }

        const hasAccess = await this.checkEvidenceAccess(userId, userRole, evidence);
        if (!hasAccess) {
            throw new Error('Forbidden: You do not have access to this evidence');
        }

        return evidence;
    }

    /**
     * Verify evidence with authorization check
     */
    async verifyEvidenceWithAuth(
        evidenceId: string,
        userId: string,
        userEmail: string,
        status: VerificationStatus,
        notes?: string
    ) {
        // Fetch evidence with necessary relations for auth check
        const evidence = await prisma.enhancedEvidence.findUnique({
            where: { id: evidenceId },
            include: {
                response: {
                    include: {
                        assessment: {
                            include: {
                                project: {
                                    include: {
                                        organization: {
                                            include: { members: true },
                                        },
                                    },
                                },
                                invitations: true,
                            },
                        },
                    },
                },
            },
        });

        if (!evidence) {
            return null;
        }

        // Check if user is authorized to verify evidence
        // Only organization members or partner admins can verify
        const isOrgMember = evidence.response.assessment.project.organization?.members.some(
            (member) => member.userId === userId
        ) ?? false;

        const isPartnerAdmin = evidence.response.assessment.invitations.some(
            (inv) =>
                inv.email === userEmail &&
                inv.status === 'ACCEPTED' &&
                inv.email === evidence.response.assessment.partnerAdminEmail
        );

        if (!isOrgMember && !isPartnerAdmin) {
            throw new Error('Forbidden: You are not authorized to verify this evidence');
        }

        // Update evidence verification status
        return await prisma.enhancedEvidence.update({
            where: { id: evidenceId },
            data: {
                verificationStatus: status,
                verifiedBy: userId,
                verifiedAt: new Date(),
                verificationNotes: notes,
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                verifier: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    /**
     * Validate evidence with authorization check
     */
    async validateEvidenceWithAuth(
        evidenceId: string,
        userId: string,
        userRole: string,
        status: VerificationStatus,
        notes?: string
    ) {
        // Get evidence with project info
        const evidence = await prisma.enhancedEvidence.findUnique({
            where: { id: evidenceId },
            include: {
                response: {
                    include: {
                        assessment: {
                            include: {
                                project: true,
                            },
                        },
                    },
                },
            },
        });

        if (!evidence) {
            throw new Error('Evidence not found');
        }

        // Auth check - only ADMIN or REVIEWER can validate
        if (userRole !== 'ADMIN') {
            const org = await prisma.organizationMember.findFirst({
                where: {
                    organizationId: evidence.response.assessment.project.organizationId,
                    userId,
                    deletedAt: null,
                    role: { in: ['ADMIN', 'REVIEWER'] }
                },
                select: { role: true }
            });

            if (!org) {
                throw new Error('Forbidden: Only admins and reviewers can validate evidence');
            }
        }

        return this.validateEvidence({
            evidenceId,
            status,
            verifiedBy: userId,
            notes
        });
    }

    /**
     * List evidence for organization with authorization check
     */
    async listEvidenceWithAuth(
        userId: string,
        userRole: string,
        organizationId: string,
        filters: {
            layer?: EvidenceLayer;
            status?: VerificationStatus;
            limit?: number;
            offset?: number;
        }
    ) {
        // Auth check
        if (userRole !== 'ADMIN') {
            const userOrgs = await prisma.organizationMember.findMany({
                where: { userId, deletedAt: null },
                select: { organizationId: true }
            });

            const hasAccess = userOrgs.some(org => org.organizationId === organizationId);
            if (!hasAccess) {
                throw new Error('Forbidden: You do not have access to this organization');
            }
        }

        return await prisma.enhancedEvidence.findMany({
            where: {
                uploader: {
                    organizations: {
                        some: {
                            organizationId: organizationId,
                        },
                    },
                },
                ...(filters.layer && { layer: filters.layer }),
                ...(filters.status && { verificationStatus: filters.status }),
            },
            include: {
                uploader: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 50,
            skip: filters.offset || 0,
        });
    }

    /**
     * Check if user has access to evidence
     */
    private async checkEvidenceAccess(userId: string, userRole: string, evidence: any): Promise<boolean> {
        // 1. Admin access
        if (userRole === 'ADMIN') {
            return true;
        }

        // 2. Check if user belongs to same organization as evidence uploader
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true, role: true }
        });

        const uploaderOrgs = await prisma.organizationMember.findMany({
            where: { userId: evidence.uploadedBy, deletedAt: null },
            select: { organizationId: true }
        });

        const hasOrgAccess = userOrgs.some(userOrg =>
            uploaderOrgs.some(uploaderOrg => uploaderOrg.organizationId === userOrg.organizationId)
        );

        if (hasOrgAccess) {
            return true;
        }

        // 3. Reviewer access
        const isReviewer = userOrgs.some(org =>
            ['ADMIN', 'REVIEWER'].includes(org.role)
        );

        return isReviewer;
    }
}

// Export singleton instance
export const evidenceService = new EvidenceService();
