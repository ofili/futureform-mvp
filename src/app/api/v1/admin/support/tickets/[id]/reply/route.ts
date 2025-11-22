import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, isInternal } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: params.id },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        const newMessage = await prisma.supportTicketMessage.create({
            data: {
                ticketId: params.id,
                userId: session.user.id,
                message,
                isInternal: isInternal || false,
            },
        });

        // If it's not an internal note, we might want to update the ticket status or notify the user
        // For now, we'll just update the updated_at timestamp of the ticket
        await prisma.supportTicket.update({
            where: { id: params.id },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({ data: newMessage });
    } catch (error) {
        console.error('Error replying to ticket:', error);
        return NextResponse.json(
            { error: 'Failed to reply to ticket' },
            { status: 500 }
        );
    }
}
