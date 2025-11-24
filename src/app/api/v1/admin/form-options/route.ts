import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // Allow public access for registration page
        // const session = await auth();
        // if (!session?.user || session.user.role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where = category ? { category } : {};

        const options = await prisma.formOption.findMany({
            where,
            orderBy: [
                { category: 'asc' },
                { displayOrder: 'asc' }
            ]
        });

        return NextResponse.json(options);
    } catch (error) {
        console.error('Get form options error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const option = await prisma.formOption.create({
            data: body
        });

        return NextResponse.json(option);
    } catch (error) {
        console.error('Create form option error:', error);
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
            return NextResponse.json({ error: 'Option ID required' }, { status: 400 });
        }

        try {
            const option = await prisma.formOption.update({
                where: { id },
                data
            });
            return NextResponse.json(option);
        } catch (dbError: any) {
            if (dbError.code === 'P2002') {
                return NextResponse.json({ error: 'An option with this value already exists in this category' }, { status: 409 });
            }
            throw dbError;
        }
    } catch (error) {
        console.error('Update form option error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Option ID required' }, { status: 400 });
        }

        await prisma.formOption.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete form option error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
