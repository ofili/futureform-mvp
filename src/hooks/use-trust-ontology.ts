import { useState, useEffect, useCallback } from 'react';
import {
    TrustLayerWithSubDimensions,
    TrustQuestionWithSubDimension,
    TrustPartnerType,
    QuestionFilters
} from '@/types/trust';

interface UseTrustOntologyReturn {
    layers: TrustLayerWithSubDimensions[];
    questions: TrustQuestionWithSubDimension[];
    partnerTypes: TrustPartnerType[];
    isLoading: boolean;
    error: string | null;
    fetchLayers: () => Promise<void>;
    fetchQuestions: (filters?: QuestionFilters) => Promise<void>;
    fetchPartnerTypes: () => Promise<void>;
}

export function useTrustOntology(): UseTrustOntologyReturn {
    const [layers, setLayers] = useState<TrustLayerWithSubDimensions[]>([]);
    const [questions, setQuestions] = useState<TrustQuestionWithSubDimension[]>([]);
    const [partnerTypes, setPartnerTypes] = useState<TrustPartnerType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLayers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/trust/layers');
            if (!response.ok) throw new Error('Failed to fetch layers');
            const data = await response.json();
            if (data.success) {
                setLayers(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch layers');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchQuestions = useCallback(async (filters?: QuestionFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            let url = '/api/v1/trust/questions';
            if (filters) {
                const params = new URLSearchParams();
                if (filters.partnerTypeId) params.append('partnerTypeId', filters.partnerTypeId);
                if (filters.layerId) params.append('layerId', filters.layerId);
                if (filters.stakeholderType) params.append('stakeholderType', filters.stakeholderType);
                if (filters.evidenceWeight) params.append('evidenceWeight', filters.evidenceWeight);
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch questions');
            const data = await response.json();
            if (data.success) {
                setQuestions(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch questions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPartnerTypes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/trust/partner-types');
            if (!response.ok) throw new Error('Failed to fetch partner types');
            const data = await response.json();
            if (data.success) {
                setPartnerTypes(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch partner types');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        layers,
        questions,
        partnerTypes,
        isLoading,
        error,
        fetchLayers,
        fetchQuestions,
        fetchPartnerTypes
    };
}
