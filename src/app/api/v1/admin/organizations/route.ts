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
        const search = searchParams.get('search');
        const tier = searchParams.get('tier');
        const stage = searchParams.get('stage');

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (tier) {
            where.tierId = tier;
        }

        if (stage) {
            where.relationshipStage = stage;
        }

        const organizations = await prisma.organization.findMany({
            where,
            include: {
                tier: true,
                members: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                },
                credits: {
                    select: {
                        id: true,
                        amount: true
                    },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(organizations);
    } catch (error) {
        console.error('Get organizations error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
        }

        const organization = await prisma.organization.update({
            where: { id },
            data,
            include: {
                tier: true,
                members: {
                    where: { deletedAt: null }
                }
            }
        });

        return NextResponse.json(organization);
    } catch (error) {
        console.error('Update organization error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
