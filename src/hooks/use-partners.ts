import { useQuery } from '@tanstack/react-query';

export interface Partner {
    id: string; // This is the Alias ID
    displayName: string;
    cachedSector?: string;
    cachedCountry?: string;
    partner: {
        id: string; // Global Partner ID
        legalName: string;
        website?: string;
        verification: string;
        contacts?: Array<{
            name?: string;
            email?: string;
        }>;
    };
}

async function fetchPartners() {
    const res = await fetch('/api/v1/partners');
    if (!res.ok) {
        throw new Error('Failed to fetch partners');
    }
    const data = await res.json();
    return data.partners as Partner[];
}

export function usePartners() {
    return useQuery({
        queryKey: ['partners'],
        queryFn: fetchPartners,
    });
}
