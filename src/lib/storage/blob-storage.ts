import { storageService, STORAGE_BUCKETS } from '@/lib/supabase/storage';

/**
 * Blob Storage Service (Migrated to Supabase)
 * Handles file upload, deletion, and management for evidence files
 */
export class BlobStorageService {
    /**
     * Upload a file to storage (Supabase)
     * @param file File to upload
     * @param path Storage path
     * @returns Object containing the public URL and storage key
     */
    async uploadFile(file: File, path: string): Promise<{ url: string; key: string }> {
        const url = await storageService.uploadFile(STORAGE_BUCKETS.EVIDENCE, path, file);

        if (!url) {
            throw new Error('Failed to upload file to storage');
        }

        return {
            url,
            key: path,
        };
    }

    /**
     * Delete a file from storage (Supabase)
     * @param url The blob URL (unused in Supabase implementation, we use key/path)
     * @param key The storage key/path (optional in interface but required for Supabase)
     */
    async deleteFile(url: string): Promise<void> {
        // Extract path from URL if key is not available, or assume url is the key if it looks like a path
        // For Supabase, we need the path within the bucket
        let path = url;
        if (url.includes('/storage/v1/object/public/')) {
            const parts = url.split(`/${STORAGE_BUCKETS.EVIDENCE}/`);
            if (parts.length > 1) {
                path = parts[1];
            }
        }

        await storageService.deleteFile(STORAGE_BUCKETS.EVIDENCE, path);
    }

    /**
     * List files with a given prefix
     * @param prefix Path prefix to filter files
     * @returns Array of blob objects
     */
    async listFiles(prefix: string) {
        // Not implemented for Supabase in this compatibility layer
        // If needed, we can add listFiles to StorageService
        return [];
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
        return `${assessmentId}/${questionId}/${timestamp}-${sanitizedFileName}`;
    }
}

export const blobStorageService = new BlobStorageService();
