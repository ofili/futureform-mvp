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
        const projectId = searchParams.get('projectId');

        const where: any = {};

        if (organizationId) {
            where.project = {
                organizationId
            };
        }

        if (projectId) {
            where.projectId = projectId;
        }

        if (status) {
            where.status = status;
        }

        const assessments = await prisma.assessment.findMany({
            where,
            include: {
                project: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                partner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                responses: {
                    select: {
                        id: true,
                        questionId: true,
                        response: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Get assessments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
