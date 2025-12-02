import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/trust/partner-types/[id]
 * 
 * Get a specific partner type with required roles
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const partnerType = await trustOntologyService.getPartnerTypeById(id);

        if (!partnerType) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Partner type not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: partnerType,
        });
    } catch (error) {
        console.error('Error fetching partner type:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch partner type',
            },
            { status: 500 }
        );
    }
}
