import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function getUserFromToken(request: NextRequest) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = getUserFromToken(request);

        // If no user token, check if it's a public token access (for invited partners)
        // For now, we'll assume authenticated user for simplicity
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                project: {
                    select: { id: true, name: true }
                },
                scores: true,
                redFlags: true,
                responses: {
                    include: {
                        question: {
                            select: { text: true, domain: true }
                        }
                    }
                }
            }
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json(assessment);
    } catch (error) {
        console.error('Get assessment error:', error);
        return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
    }
}
