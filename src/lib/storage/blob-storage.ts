import { put, del, list } from '@vercel/blob';

/**
 * Vercel Blob Storage Service
 * Handles file upload, deletion, and management for evidence files
 */
export class BlobStorageService {
    /**
     * Upload a file to Vercel Blob storage
     * @param file File to upload
     * @param path Storage path (e.g., 'evidence/assessment-id/file-name.pdf')
     * @returns Object containing the public URL and storage key
     */
    async uploadFile(file: File, path: string): Promise<{ url: string; key: string }> {
        try {
            const blob = await put(path, file, {
                access: 'public',
                addRandomSuffix: false,
            });

            return {
                url: blob.url,
                key: blob.pathname,
            };
        } catch (error) {
            console.error('Blob upload error:', error);
            throw new Error('Failed to upload file to storage');
        }
    }

    /**
     * Delete a file from Vercel Blob storage
     * @param url The blob URL to delete
     */
    async deleteFile(url: string): Promise<void> {
        try {
            await del(url);
        } catch (error) {
            console.error('Blob deletion error:', error);
            throw new Error('Failed to delete file from storage');
        }
    }

    /**
     * List files with a given prefix
     * @param prefix Path prefix to filter files
     * @returns Array of blob objects
     */
    async listFiles(prefix: string) {
        try {
            const { blobs } = await list({ prefix });
            return blobs.map(blob => ({
                url: blob.url,
                key: blob.pathname,
                size: blob.size,
                uploadedAt: blob.uploadedAt,
            }));
        } catch (error) {
            console.error('Blob list error:', error);
            throw new Error('Failed to list files from storage');
        }
    }

    /**
     * Generate a storage path for an evidence file
     * @param assessmentId Assessment ID
     * @param questionId Question ID
     * @param fileName Original file name
     * @returns Storage path string
     */
    generatePath(assessmentId: string, questionId: string, fileName: string): string {
        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        return `evidence/${assessmentId}/${questionId}/${timestamp}-${sanitizedFileName}`;
    }
}

export const blobStorageService = new BlobStorageService();
