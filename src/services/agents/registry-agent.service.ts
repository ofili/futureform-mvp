import { evidenceFactService } from '../evidence-facts/evidence-fact.service';
import { monoService, CACCompanyData } from '../mono/mono.service';
import { FactType, FactSource } from '@prisma/client';
import { logger } from '@/lib/logger';

interface RegistryResult {
    registrationNumber: string;
    companyName: string;
    status: string;
    registrationDate?: string;
    address?: string;
    directors?: string[];
    rawResponse: CACCompanyData;
}

export class RegistryAgentService {
    /**
     * Check company registration status using Mono CAC API
     * Currently supports Nigeria only
     */
    async checkRegistration(
        companyName: string,
        assessmentId: string,
        rcNumber?: string
    ): Promise<void> {
        logger.info('Checking company registration via Mono CAC', {
            service: 'RegistryAgentService',
            method: 'checkRegistration',
            companyName,
            rcNumber,
            assessmentId
        });

        if (!monoService.isConfigured()) {
            logger.warn('Mono API not configured, skipping registry check', {
                service: 'RegistryAgentService',
                method: 'checkRegistration'
            });
            return;
        }

        try {
            let cacData: CACCompanyData | CACCompanyData[] | null = null;

            // If RC number provided, lookup directly
            if (rcNumber) {
                cacData = await monoService.lookupCompanyByRC(rcNumber);
            } else {
                // Search by company name
                const results = await monoService.lookupCompanyByName(companyName);
                if (results && results.length > 0) {
                    // Take the first match
                    cacData = results[0];
                }
            }

            if (!cacData) {
                logger.info('No CAC data found for company', {
                    service: 'RegistryAgentService',
                    method: 'checkRegistration',
                    companyName
                });

                // Store a "NOT_FOUND" fact
                await this.storeNotFoundFact(companyName, assessmentId);
                return;
            }

            // Handle single result
            const company = Array.isArray(cacData) ? cacData[0] : cacData;

            const result: RegistryResult = {
                registrationNumber: company.rcNumber,
                companyName: company.companyName,
                status: company.status,
                registrationDate: company.incorporationDate,
                address: company.registeredAddress,
                directors: company.directors?.map((d: { name: string }) => d.name),
                rawResponse: company
            };

            await this.storeRegistryFact(result, assessmentId);

        } catch (error) {
            logger.error('Failed to check CAC registry', error as Error, {
                service: 'RegistryAgentService',
                method: 'checkRegistration',
                companyName
            });
            throw error;
        }
    }

    /**
     * Store registry result as EvidenceFact
     */
    private async storeRegistryFact(
        result: RegistryResult,
        assessmentId: string
    ): Promise<void> {
        const content = `
Registry: Nigeria CAC (Official via Mono)
Company: ${result.companyName}
Status: ${result.status}
RC Number: ${result.registrationNumber}
Incorporation Date: ${result.registrationDate || 'N/A'}
Address: ${result.address || 'N/A'}
Directors: ${result.directors?.join(', ') || 'N/A'}
        `.trim();

        await evidenceFactService.createFact({
            assessmentId,
            factType: FactType.EXTERNAL_REGISTRY,
            source: FactSource.COMPANY_REGISTRY,
            rawContent: content,
            normalizedValue: result.status,
            collectedBy: 'AGENT:MONO_CAC',
            confidence: 1.0 // High confidence for official registry
        });
    }

    /**
     * Store a NOT_FOUND fact when company is not in registry
     */
    private async storeNotFoundFact(
        companyName: string,
        assessmentId: string
    ): Promise<void> {
        const content = `
Registry: Nigeria CAC (Official via Mono)
Company: ${companyName}
Status: NOT_FOUND
Note: No matching company found in CAC registry
        `.trim();

        await evidenceFactService.createFact({
            assessmentId,
            factType: FactType.EXTERNAL_REGISTRY,
            source: FactSource.COMPANY_REGISTRY,
            rawContent: content,
            normalizedValue: 'NOT_FOUND',
            collectedBy: 'AGENT:MONO_CAC',
            confidence: 1.0
        });
    }
}

export const registryAgentService = new RegistryAgentService();
