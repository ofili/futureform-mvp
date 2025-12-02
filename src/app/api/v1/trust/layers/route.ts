import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/trust/layers
 * 
 * Get all trust layers with their sub-dimensions
 */
export async function GET(request: NextRequest) {
    try {
        const result = await trustOntologyService.getAllLayers();

        return NextResponse.json({
            success: true,
            data: result.layers,
            total: result.total,
        });
    } catch (error) {
        console.error('Error fetching trust layers:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch trust layers',
            },
            { status: 500 }
        );
    }
}
