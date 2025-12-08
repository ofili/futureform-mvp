import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL not found, using placeholder');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
    EVIDENCE: 'evidence-documents',
    REPORTS: 'reports',
    RESEARCH_CACHE: 'research-cache'
};

export class StorageService {
    /**
     * Upload a file to Supabase Storage
     */
    async uploadFile(bucket: string, path: string, file: File | Blob): Promise<string | null> {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            logger.error('Failed to upload file to Supabase', error as Error, {
                service: 'StorageService',
                method: 'uploadFile',
                bucket,
                path
            });
            return null;
        }
    }

    /**
     * Download a file from Supabase Storage
     */
    async downloadFile(bucket: string, path: string): Promise<Blob | null> {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .download(path);

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Failed to download file from Supabase', error as Error, {
                service: 'StorageService',
                method: 'downloadFile',
                bucket,
                path
            });
            return null;
        }
    }

    /**
     * Delete a file from Supabase Storage
     */
    async deleteFile(bucket: string, path: string): Promise<boolean> {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            logger.error('Failed to delete file from Supabase', error as Error, {
                service: 'StorageService',
                method: 'deleteFile',
                bucket,
                path
            });
            return false;
        }
    }
}

export const storageService = new StorageService();
