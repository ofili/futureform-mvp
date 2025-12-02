import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/trust/partner-types
 * 
 * Get all partner types
 */
export async function GET(request: NextRequest) {
    try {
        const result = await trustOntologyService.getPartnerTypes();

        return NextResponse.json({
            success: true,
            data: result.partnerTypes,
            total: result.total,
        });
    } catch (error) {
        console.error('Error fetching partner types:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch partner types',
            },
            { status: 500 }
        );
    }
}
