import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/roles
 * 
 * Get all active roles
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const roles = await prisma.role.findMany({
            where: { active: true },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ roles }, { status: 200 });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
