'use client';

import { useState, useCallback } from 'react';

interface Evidence {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    storageUrl: string;
    uploadedAt: string;
    validationStatus: string;
}

interface UseEvidenceReturn {
    evidence: Evidence[];
    isLoading: boolean;
    error: string | null;
    uploadEvidence: (file: File, questionId: string) => Promise<Evidence>;
    deleteEvidence: (evidenceId: string) => Promise<void>;
    fetchEvidence: () => Promise<void>;
}

export function useEvidence(assessmentId: string): UseEvidenceReturn {
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvidence = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/v1/assessments/${assessmentId}/evidence`);

            if (!response.ok) {
                throw new Error('Failed to fetch evidence');
            }

            const data = await response.json();
            setEvidence(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch evidence');
        } finally {
            setIsLoading(false);
        }
    }, [assessmentId]);

    const uploadEvidence = useCallback(async (file: File, questionId: string): Promise<Evidence> => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('assessmentId', assessmentId);
            formData.append('questionId', questionId);

            const response = await fetch('/api/v1/evidence/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await response.json();
            const newEvidence = data.data;

            // Add to local state
            setEvidence(prev => [newEvidence, ...prev]);

            return newEvidence;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [assessmentId]);

    const deleteEvidence = useCallback(async (evidenceId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/v1/evidence/${evidenceId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Delete failed');
            }

            // Remove from local state
            setEvidence(prev => prev.filter(e => e.id !== evidenceId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Delete failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        evidence,
        isLoading,
        error,
        uploadEvidence,
        deleteEvidence,
        fetchEvidence,
    };
}
