
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export interface CreateClarificationInput {
    assessmentResponseId: string;
    reviewerUserId: string;
    message: string;
    deadline: Date;
}

export interface ReplyClarificationInput {
    assessmentResponseId: string;
    responseText: string;
    files?: string[];
}

export class ClarificationService {
    /**
     * Create a clarification request
     */
    async createRequest(data: CreateClarificationInput) {
        logger.info('Creating clarification request', {
            service: 'ClarificationService',
            method: 'createRequest',
            responseId: data.assessmentResponseId
        });

        // Use transaction to ensure data consistency
        return prisma.$transaction(async (tx) => {
            // 1. Create Request
            const request = await tx.clarificationRequest.create({
                data: {
                    assessmentResponseId: data.assessmentResponseId,
                    reviewerUserId: data.reviewerUserId,
                    clarificationMessage: data.message,
                    responseDeadline: data.deadline,
                }
            });

            // 2. Update Response Status
            await tx.assessmentResponse.update({
                where: { id: data.assessmentResponseId },
                data: {
                    validationStatus: 'CLARIFICATION_REQUESTED',
                    validated: false,
                }
            });

            return request;
        });
    }

    /**
     * Reply to a clarification request
     */
    async submitReply(data: ReplyClarificationInput) {
        logger.info('Submitting clarification reply', {
            service: 'ClarificationService',
            method: 'submitReply',
            responseId: data.assessmentResponseId
        });

        return prisma.$transaction(async (tx) => {
            // 1. Find active request
            const activeRequest = await tx.clarificationRequest.findFirst({
                where: {
                    assessmentResponseId: data.assessmentResponseId,
                    partnerRespondedAt: null,
                },
                orderBy: { createdAt: 'desc' },
            });

            if (!activeRequest) {
                throw new Error('No active clarification request found');
            }

            // 2. Update Request
            await tx.clarificationRequest.update({
                where: { id: activeRequest.id },
                data: {
                    partnerResponse: data.responseText,
                    partnerResponseFiles: data.files || [],
                    partnerRespondedAt: new Date(),
                }
            });

            // 3. Reset Response Status
            await tx.assessmentResponse.update({
                where: { id: data.assessmentResponseId },
                data: {
                    validationStatus: 'PENDING',
                }
            });

            return { success: true };
        });
    }
}

export const clarificationService = new ClarificationService();
