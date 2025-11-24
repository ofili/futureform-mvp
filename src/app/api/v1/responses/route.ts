import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * POST /api/v1/responses
 * 
 * Create or update an assessment response
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { assessmentId, questionId, answer } = body;

        if (!assessmentId || !questionId || !answer) {
            return NextResponse.json(
                { error: 'assessmentId, questionId, and answer are required' },
                { status: 400 }
            );
        }

        // Verify user has access to this assessment
        const invitation = await prisma.assessmentInvitation.findFirst({
            where: {
                assessmentId,
                email: session.user.email,
                status: 'ACCEPTED',
            },
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if response already exists
        const existingResponse = await prisma.assessmentResponse.findFirst({
            where: {
                assessmentId,
                questionId,
                userId: session.user.id,
            },
        });

        let response;
        if (existingResponse) {
            // Update existing response
            response = await prisma.assessmentResponse.update({
                where: { id: existingResponse.id },
                data: {
                    response: answer,
                    updatedAt: new Date(),
                },
                include: {
                    question: true,
                    evidenceUploads: true,
                },
            });
        } else {
            // Create new response
            response = await prisma.assessmentResponse.create({
                data: {
                    assessmentId,
                    questionId,
                    userId: session.user.id,
                    response: answer,
                },
                include: {
                    question: true,
                    evidenceUploads: true,
                },
            });
        }

        return NextResponse.json({ response }, { status: 200 });
    } catch (error) {
        console.error('Error saving response:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
