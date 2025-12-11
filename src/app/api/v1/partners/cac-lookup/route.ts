import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { monoService } from '@/services/mono/mono.service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const lookupSchema = z.object({
    rcNumber: z.string().min(1),
});

// POST /api/v1/partners/cac-lookup - Lookup company by RC number
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = lookupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'RC Number is required' }, { status: 400 });
        }

        const { rcNumber } = validation.data;

        // Check if Mono is configured
        if (!monoService.isConfigured()) {
            logger.warn('Mono API not configured, returning mock data');
            // Return mock data for testing when API not configured
            return NextResponse.json({
                data: {
                    rcNumber,
                    companyName: `Company ${rcNumber}`,
                    companyType: 'Limited Liability Company',
                    registeredAddress: 'Lagos, Nigeria',
                    incorporationDate: '2020-01-15',
                    status: 'ACTIVE',
                    directors: [],
                },
                message: 'Mock data - Mono API not configured',
            });
        }

        // Lookup company via Mono
        const companyData = await monoService.lookupCompanyByRC(rcNumber);

        logger.info('CAC lookup successful', {
            service: 'PartnerAPI',
            method: 'cacLookup',
            rcNumber,
            companyName: companyData.companyName,
        });

        return NextResponse.json({
            data: companyData,
            message: 'Company found',
        });
    } catch (error: any) {
        logger.error('CAC lookup failed', error, { service: 'PartnerAPI', method: 'cacLookup' });
        return NextResponse.json(
            { error: error.message || 'CAC lookup failed' },
            { status: 400 }
        );
    }
}
