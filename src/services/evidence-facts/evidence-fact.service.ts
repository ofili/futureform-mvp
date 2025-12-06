import prisma from '@/lib/prisma';
import { FactType, FactSource, EvidenceFact } from '@prisma/client';
import { logger } from '@/lib/logger';

export interface CreateFactInput {
    assessmentId: string;
    factType: FactType;
    source: FactSource;
    rawContent: string;
    questionId?: string;
    partnerId?: string;
    sourceUrl?: string;
    normalizedValue?: string;
    confidence?: number;
    collectedBy?: string;
}

export class EvidenceFactService {
    /**
     * Create a new evidence fact
     */
    async createFact(data: CreateFactInput): Promise<EvidenceFact> {
        logger.info('Creating evidence fact', {
            service: 'EvidenceFactService',
            method: 'createFact',
            assessmentId: data.assessmentId,
            factType: data.factType,
            source: data.source
        });

        return await prisma.evidenceFact.create({
            data: {
                assessmentId: data.assessmentId,
                factType: data.factType,
                source: data.source,
                rawContent: data.rawContent,
                questionId: data.questionId,
                partnerId: data.partnerId,
                sourceUrl: data.sourceUrl,
                normalizedValue: data.normalizedValue,
                confidence: data.confidence ?? 1.0,
                collectedBy: data.collectedBy,
                collectedAt: new Date()
            }
        });
    }

    /**
     * Get all facts for an assessment
     */
    async getFactsForAssessment(assessmentId: string): Promise<EvidenceFact[]> {
        return await prisma.evidenceFact.findMany({
            where: { assessmentId },
            orderBy: { collectedAt: 'desc' }
        });
    }

    /**
     * Get facts filtered by type
     */
    async getFactsByType(assessmentId: string, factType: FactType): Promise<EvidenceFact[]> {
        return await prisma.evidenceFact.findMany({
            where: {
                assessmentId,
                factType
            },
            orderBy: { collectedAt: 'desc' }
        });
    }

    /**
     * Validate a fact
     */
    async validateFact(factId: string, userId: string): Promise<EvidenceFact> {
        logger.info('Validating evidence fact', {
            service: 'EvidenceFactService',
            method: 'validateFact',
            factId,
            userId
        });

        return await prisma.evidenceFact.update({
            where: { id: factId },
            data: {
                validatedAt: new Date(),
                validatedBy: userId
            }
        });
    }

    /**
     * Delete a fact
     */
    async deleteFact(factId: string): Promise<void> {
        await prisma.evidenceFact.delete({
            where: { id: factId }
        });
    }
}

export const evidenceFactService = new EvidenceFactService();
