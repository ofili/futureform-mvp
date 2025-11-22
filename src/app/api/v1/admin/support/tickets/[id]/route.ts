import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignedUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ data: ticket });
    } catch (error) {
        console.error('Error fetching support ticket:', error);
        return NextResponse.json(
            { error: 'Failed to fetch support ticket' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status, priority, assignedTo } = await req.json();

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: params.id },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Prepare update data
        const updateData: any = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

        // Set resolvedAt timestamp if status changes to RESOLVED or CLOSED
        if (status && (status === 'RESOLVED' || status === 'CLOSED') && !ticket.resolvedAt) {
            updateData.resolvedAt = new Date();
        }

        const updatedTicket = await prisma.supportTicket.update({
            where: { id: params.id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignedUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({ data: updatedTicket });
    } catch (error) {
        console.error('Error updating support ticket:', error);
        return NextResponse.json(
            { error: 'Failed to update support ticket' },
            { status: 500 }
        );
    }
}
