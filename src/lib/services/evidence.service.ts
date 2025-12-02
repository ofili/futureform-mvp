import prisma from '@/lib/prisma';
import { blobStorageService } from '../storage/blob-storage';
import { FileValidator } from '../validation/file-validator';

export interface UploadEvidenceDto {
    file: File;
    assessmentId: string;
    questionId: string;
    respondentId?: string;
    uploadedById: string;
}

export interface Evidence {
    id: string;
    assessmentId: string;
    questionId: string | null;
    responseId: string | null;
    fileName: string;
    fileType: string;
    fileSize: number;
    storageUrl: string;
    storageKey: string;
    uploadedById: string;
    uploadedAt: Date;
    validationStatus: string;
    processingStatus: string;
}

/**
 * Evidence Service
 * Manages evidence file uploads, validation, and retrieval
 */
export class EvidenceService {
    /**
     * Upload evidence file
     */
    async uploadEvidence(data: UploadEvidenceDto): Promise<Evidence> {
        const { file, assessmentId, questionId, respondentId, uploadedById } = data;

        // Validate file
        const fileValidation = FileValidator.validateFile(file);
        if (!fileValidation.valid) {
            throw new Error(fileValidation.error);
        }

        // Check existing files for this question
        const existingFiles = await prisma.trustEvidenceFile.findMany({
            where: { assessmentId, questionId },
            select: { fileSize: true },
        });

        // Validate file count
        const countValidation = FileValidator.validateQuestionFileCount(existingFiles.length);
        if (!countValidation.valid) {
            throw new Error(countValidation.error);
        }

        // Validate total size
        const sizeValidation = FileValidator.validateQuestionSize(existingFiles, file);
        if (!sizeValidation.valid) {
            throw new Error(sizeValidation.error);
        }

        // Upload to Vercel Blob
        const storagePath = blobStorageService.generatePath(assessmentId, questionId, file.name);
        const { url, key } = await blobStorageService.uploadFile(file, storagePath);

        // Save to database
        const evidence = await prisma.trustEvidenceFile.create({
            data: {
                assessmentId,
                questionId,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                storageUrl: url,
                storageKey: key,
                uploadedById,
                validationStatus: 'PENDING',
                processingStatus: 'PENDING',
            },
        });

        return evidence as Evidence;
    }

    /**
     * Get all evidence for an assessment
     */
    async getEvidenceByAssessment(assessmentId: string): Promise<Evidence[]> {
        const evidence = await prisma.trustEvidenceFile.findMany({
            where: { assessmentId },
            orderBy: { uploadedAt: 'desc' },
        });

        return evidence as Evidence[];
    }

    /**
     * Get evidence for a specific question
     */
    async getEvidenceByQuestion(questionId: string): Promise<Evidence[]> {
        const evidence = await prisma.trustEvidenceFile.findMany({
            where: { questionId },
            orderBy: { uploadedAt: 'desc' },
        });

        return evidence as Evidence[];
    }

    /**
     * Delete evidence file
     */
    async deleteEvidence(evidenceId: string, userId: string): Promise<void> {
        const evidence = await prisma.trustEvidenceFile.findUnique({
            where: { id: evidenceId },
        });

        if (!evidence) {
            throw new Error('Evidence not found');
        }

        // Check if user owns the evidence
        if (evidence.uploadedById !== userId) {
            throw new Error('Unauthorized to delete this evidence');
        }

        // Delete from Vercel Blob
        await blobStorageService.deleteFile(evidence.storageUrl);

        // Delete from database
        await prisma.trustEvidenceFile.delete({
            where: { id: evidenceId },
        });
    }

    /**
     * Validate evidence (admin/analyst only)
     */
    async validateEvidence(
        evidenceId: string,
        status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW',
        validatedById: string,
        notes?: string
    ): Promise<Evidence> {
        const evidence = await prisma.trustEvidenceFile.update({
            where: { id: evidenceId },
            data: {
                validationStatus: status,
                validatedById,
                validatedAt: new Date(),
                validationNotes: notes,
            },
        });

        return evidence as Evidence;
    }
}

export const evidenceService = new EvidenceService();
