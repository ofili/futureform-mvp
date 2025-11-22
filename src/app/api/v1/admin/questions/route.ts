import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const questions = await prisma.question.findMany({
            orderBy: {
                order: 'asc',
            },
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { domain, text, helpText, title, category, weight, order } = data;

        if (!domain || !text || !category || order === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const question = await prisma.question.create({
            data: {
                domain,
                text,
                helpText,
                title,
                category,
                weight: weight || 1.0,
                order,
            },
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
