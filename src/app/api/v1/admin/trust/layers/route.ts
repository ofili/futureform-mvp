import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/admin/trust/layers
 * Get all trust layers with sub-dimensions
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const layers = await prisma.trustLayer.findMany({
            include: {
                subDimensions: {
                    orderBy: { dimensionId: 'asc' },
                },
            },
            orderBy: { layerId: 'asc' },
        });

        return NextResponse.json({ success: true, data: layers });
    } catch (error) {
        console.error('Error fetching trust layers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trust layers' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/v1/admin/trust/layers
 * Update layer weights
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { layerId, baselineWeight, description } = body;

        if (!layerId) {
            return NextResponse.json(
                { error: 'layerId is required' },
                { status: 400 }
            );
        }

        const updated = await prisma.trustLayer.update({
            where: { layerId },
            data: {
                ...(baselineWeight !== undefined && { baselineWeight }),
                ...(description !== undefined && { description }),
            },
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating trust layer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update trust layer' },
            { status: 500 }
        );
    }
}
