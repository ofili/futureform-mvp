import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                project: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                sectorFocus: true,
                                region: true,
                            },
                        },
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                partner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                responses: {
                    include: {
                        question: {
                            select: {
                                id: true,
                                text: true,
                                category: true,
                                weight: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json({ data: assessment });
    } catch (error) {
        console.error('Error fetching assessment:', error);
        return NextResponse.json(
            { error: 'Failed to fetch assessment' },
            { status: 500 }
        );
    }
}
