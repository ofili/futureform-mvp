// Mono Service
// Handles integration with Mono API for CAC verification

import { logger } from '@/lib/logger';

export interface CACCompanyData {
    rcNumber: string;
    companyName: string;
    companyType: string;
    registeredAddress: string;
    incorporationDate: string;
    status: string;
    directors?: Array<{
        name: string;
        position?: string;
        appointmentDate?: string;
    }>;
}

export interface CACLookupResponse {
    status: string;
    message: string;
    data?: CACCompanyData;
}

export class MonoService {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.MONO_SECRET_KEY || '';
        this.baseUrl = process.env.MONO_API_URL || 'https://api.withmono.com/v1';

        if (!this.apiKey) {
            logger.warn('MONO_SECRET_KEY not configured', {
                service: 'MonoService',
            });
        }
    }

    /**
     * Lookup company by RC/CAC number
     */
    async lookupCompanyByRC(rcNumber: string): Promise<CACCompanyData> {
        logger.info('Looking up company by RC number', {
            service: 'MonoService',
            method: 'lookupCompanyByRC',
            rcNumber,
        });

        if (!this.apiKey) {
            throw new Error('Mono API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/cac/lookup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'mono-sec-key': this.apiKey,
                },
                body: JSON.stringify({
                    rc_number: rcNumber,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                logger.error('Mono API error', {
                    service: 'MonoService',
                    method: 'lookupCompanyByRC',
                    status: response.status,
                    error: errorData,
                });
                throw new Error(`CAC lookup failed: ${response.statusText}`);
            }

            const data: CACLookupResponse = await response.json();

            if (data.status !== 'success' || !data.data) {
                throw new Error(data.message || 'CAC lookup failed');
            }

            logger.info('Company lookup successful', {
                service: 'MonoService',
                method: 'lookupCompanyByRC',
                rcNumber,
                companyName: data.data.companyName,
            });

            return data.data;
        } catch (error) {
            logger.error('Error looking up company', {
                service: 'MonoService',
                method: 'lookupCompanyByRC',
                rcNumber,
                error,
            });
            throw error;
        }
    }

    /**
     * Lookup company by name
     */
    async lookupCompanyByName(companyName: string): Promise<CACCompanyData[]> {
        logger.info('Looking up company by name', {
            service: 'MonoService',
            method: 'lookupCompanyByName',
            companyName,
        });

        if (!this.apiKey) {
            throw new Error('Mono API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/cac/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'mono-sec-key': this.apiKey,
                },
                body: JSON.stringify({
                    company_name: companyName,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                logger.error('Mono API error', {
                    service: 'MonoService',
                    method: 'lookupCompanyByName',
                    status: response.status,
                    error: errorData,
                });
                throw new Error(`CAC search failed: ${response.statusText}`);
            }

            const data: any = await response.json();

            if (data.status !== 'success' || !data.data) {
                throw new Error(data.message || 'CAC search failed');
            }

            logger.info('Company search successful', {
                service: 'MonoService',
                method: 'lookupCompanyByName',
                companyName,
                resultsCount: data.data.length,
            });

            return data.data;
        } catch (error) {
            logger.error('Error searching company', {
                service: 'MonoService',
                method: 'lookupCompanyByName',
                companyName,
                error,
            });
            throw error;
        }
    }

    /**
     * Get detailed company information including directors
     */
    async getCompanyDetails(rcNumber: string): Promise<CACCompanyData> {
        logger.info('Getting company details', {
            service: 'MonoService',
            method: 'getCompanyDetails',
            rcNumber,
        });

        if (!this.apiKey) {
            throw new Error('Mono API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/cac/companies/${rcNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'mono-sec-key': this.apiKey,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                logger.error('Mono API error', {
                    service: 'MonoService',
                    method: 'getCompanyDetails',
                    status: response.status,
                    error: errorData,
                });
                throw new Error(`Failed to get company details: ${response.statusText}`);
            }

            const data: any = await response.json();

            if (data.status !== 'success' || !data.data) {
                throw new Error(data.message || 'Failed to get company details');
            }

            logger.info('Company details retrieved successfully', {
                service: 'MonoService',
                method: 'getCompanyDetails',
                rcNumber,
            });

            return data.data;
        } catch (error) {
            logger.error('Error getting company details', {
                service: 'MonoService',
                method: 'getCompanyDetails',
                rcNumber,
                error,
            });
            throw error;
        }
    }

    /**
     * Check if Mono API is configured
     */
    isConfigured(): boolean {
        return !!this.apiKey;
    }
}

// Export singleton instance
export const monoService = new MonoService();
