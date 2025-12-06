import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/admin/trust/sector-weights
 * Get all sector-specific weight adjustments
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sectorWeights = await prisma.trustSectorWeight.findMany({
            orderBy: { sector: 'asc' },
        });

        return NextResponse.json({ success: true, data: sectorWeights });
    } catch (error) {
        console.error('Error fetching sector weights:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch sector weights' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/v1/admin/trust/sector-weights
 * Create new sector weight configuration
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { sector, layerWeights, rationale } = body;

        if (!sector || !layerWeights) {
            return NextResponse.json(
                { error: 'sector and layerWeights are required' },
                { status: 400 }
            );
        }

        // Validate weights sum to ~1.0
        const totalWeight = Object.values(layerWeights).reduce((sum: number, w: any) => sum + (w as number), 0);
        if (Math.abs(totalWeight - 1.0) > 0.01) {
            return NextResponse.json(
                { error: `Layer weights must sum to 1.0 (current: ${totalWeight.toFixed(2)})` },
                { status: 400 }
            );
        }

        const created = await prisma.trustSectorWeight.create({
            data: {
                sector,
                layerWeights,
                rationale: rationale || `Weight configuration for ${sector}`,
            },
        });

        return NextResponse.json({ success: true, data: created }, { status: 201 });
    } catch (error) {
        console.error('Error creating sector weights:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create sector weights' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/v1/admin/trust/sector-weights
 * Update sector weight configuration
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, layerWeights, rationale } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'id is required' },
                { status: 400 }
            );
        }

        // Validate weights sum if provided
        if (layerWeights) {
            const totalWeight = Object.values(layerWeights).reduce((sum: number, w: any) => sum + (w as number), 0);
            if (Math.abs(totalWeight - 1.0) > 0.01) {
                return NextResponse.json(
                    { error: `Layer weights must sum to 1.0 (current: ${totalWeight.toFixed(2)})` },
                    { status: 400 }
                );
            }
        }

        const updated = await prisma.trustSectorWeight.update({
            where: { id },
            data: {
                ...(layerWeights !== undefined && { layerWeights }),
                ...(rationale !== undefined && { rationale }),
            },
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating sector weights:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update sector weights' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/v1/admin/trust/sector-weights
 * Delete sector weight configuration
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'id is required' },
                { status: 400 }
            );
        }

        await prisma.trustSectorWeight.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Sector weight configuration deleted' });
    } catch (error) {
        console.error('Error deleting sector weights:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete sector weights' },
            { status: 500 }
        );
    }
}
