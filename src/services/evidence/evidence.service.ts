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
}

// Export singleton instance
export const evidenceService = new EvidenceService();
