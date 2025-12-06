import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/admin/trust/veto-criteria
 * Get all veto criteria
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vetoCriteria = await prisma.trustVetoCriterion.findMany({
            orderBy: [{ layer: 'asc' }, { severity: 'desc' }],
        });

        return NextResponse.json({ success: true, data: vetoCriteria });
    } catch (error) {
        console.error('Error fetching veto criteria:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch veto criteria' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/v1/admin/trust/veto-criteria
 * Create new veto criterion
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { vetoId, name, description, layer, subDimension, thresholdValue, thresholdDescription, action, severity } = body;

        if (!vetoId || !name || !layer) {
            return NextResponse.json(
                { error: 'vetoId, name, and layer are required' },
                { status: 400 }
            );
        }

        const created = await prisma.trustVetoCriterion.create({
            data: {
                vetoId,
                name,
                description,
                layer,
                subDimension,
                thresholdValue,
                thresholdDescription,
                action: action || 'DO NOT PROCEED',
                severity: severity || 'CRITICAL',
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, data: created }, { status: 201 });
    } catch (error) {
        console.error('Error creating veto criterion:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create veto criterion' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/v1/admin/trust/veto-criteria
 * Update veto criterion
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, description, thresholdValue, thresholdDescription, action, severity, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'id is required' },
                { status: 400 }
            );
        }

        const updated = await prisma.trustVetoCriterion.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(thresholdValue !== undefined && { thresholdValue }),
                ...(thresholdDescription !== undefined && { thresholdDescription }),
                ...(action !== undefined && { action }),
                ...(severity !== undefined && { severity }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating veto criterion:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update veto criterion' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/v1/admin/trust/veto-criteria
 * Delete veto criterion (soft delete by setting isActive = false)
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

        // Soft delete
        await prisma.trustVetoCriterion.update({
            where: { id },
            data: { isActive: false },
        });

        return NextResponse.json({ success: true, message: 'Veto criterion deactivated' });
    } catch (error) {
        console.error('Error deleting veto criterion:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete veto criterion' },
            { status: 500 }
        );
    }
}
