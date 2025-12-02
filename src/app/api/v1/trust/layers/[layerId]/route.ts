import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/trust/layers/[layerId]
 * 
 * Get a specific trust layer with all questions
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ layerId: string }> }
) {
    try {
        const { layerId } = await params;

        const layer = await trustOntologyService.getLayerById(layerId);

        if (!layer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Trust layer not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: layer,
        });
    } catch (error) {
        console.error('Error fetching trust layer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch trust layer',
            },
            { status: 500 }
        );
    }
}
