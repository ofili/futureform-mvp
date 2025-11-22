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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = getUserFromToken(request);

        // If no user token, check if it's a public token access (for invited partners)
        // For now, we'll assume authenticated user for simplicity of this phase
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 });
        }

        // Use transaction to save all responses
        await prisma.$transaction(
            responses.map((r: any) =>
                prisma.assessmentResponse.upsert({
                    where: {
                        assessmentId_questionId: {
                            assessmentId: id,
                            questionId: r.questionId
                        }
                    },
                    update: {
                        response: r.response,
                        evidenceFiles: r.evidenceFiles,
                        updatedAt: new Date()
                    },
                    create: {
                        assessmentId: id,
                        questionId: r.questionId,
                        userId: userId,
                        response: r.response,
                        evidenceFiles: r.evidenceFiles
                    }
                })
            )
        );

        // Update assessment status to IN_PROGRESS
        await prisma.assessment.update({
            where: { id },
            data: { status: 'IN_PROGRESS' }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submit responses error:', error);
        return NextResponse.json({ error: 'Failed to submit responses' }, { status: 500 });
    }
}
