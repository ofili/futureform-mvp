import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get('organizationId');
        const status = searchParams.get('status');

        const where: any = {};

        if (organizationId) {
            where.organizationId = organizationId;
        }

        if (status) {
            where.status = status;
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                assessments: {
                    select: {
                        id: true,
                        status: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
