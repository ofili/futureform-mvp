import { EVIDENCE_CONSTRAINTS, EVIDENCE_ERROR_MESSAGES } from '../constants/evidence-constraints';

/**
 * File Validator
 * Validates evidence files before upload
 */
export class FileValidator {
    /**
     * Validate a file against all constraints
     * @param file File to validate
     * @returns Validation result with error message if invalid
     */
    static validateFile(file: File): { valid: boolean; error?: string } {
        // Check file size
        if (file.size > EVIDENCE_CONSTRAINTS.MAX_FILE_SIZE) {
            return { valid: false, error: EVIDENCE_ERROR_MESSAGES.FILE_TOO_LARGE };
        }

        // Check file type
        if (!(EVIDENCE_CONSTRAINTS.ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
            return { valid: false, error: EVIDENCE_ERROR_MESSAGES.INVALID_FILE_TYPE };
        }

        return { valid: true };
    }

    /**
     * Validate total size for a question
     * @param existingFiles Existing files for the question
     * @param newFile New file to upload
     * @returns Validation result
     */
    static validateQuestionSize(existingFiles: { fileSize: number }[], newFile: File): { valid: boolean; error?: string } {
        const totalSize = existingFiles.reduce((sum, f) => sum + f.fileSize, 0) + newFile.size;

        if (totalSize > EVIDENCE_CONSTRAINTS.MAX_TOTAL_SIZE_PER_QUESTION) {
            return { valid: false, error: EVIDENCE_ERROR_MESSAGES.QUESTION_SIZE_EXCEEDED };
        }

        return { valid: true };
    }

    /**
     * Validate file count for a question
     * @param existingCount Number of existing files
     * @returns Validation result
     */
    static validateQuestionFileCount(existingCount: number): { valid: boolean; error?: string } {
        if (existingCount >= EVIDENCE_CONSTRAINTS.MAX_FILES_PER_QUESTION) {
            return { valid: false, error: EVIDENCE_ERROR_MESSAGES.TOO_MANY_FILES_PER_QUESTION };
        }

        return { valid: true };
    }

    /**
     * Sanitize a file name for safe storage
     * @param fileName Original file name
     * @returns Sanitized file name
     */
    static sanitizeFileName(fileName: string): string {
        // Remove path traversal attempts
        const baseName = fileName.split('/').pop() || fileName;

        // Replace unsafe characters
        return baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
    }

    /**
     * Get file extension from file name
     * @param fileName File name
     * @returns File extension (e.g., '.pdf')
     */
    static getFileExtension(fileName: string): string {
        const match = fileName.match(/\.[^.]+$/);
        return match ? match[0].toLowerCase() : '';
    }

    /**
     * Get human-readable file size
     * @param bytes File size in bytes
     * @returns Formatted size string (e.g., '2.5 MB')
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}
