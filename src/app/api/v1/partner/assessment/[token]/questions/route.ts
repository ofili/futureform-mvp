import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        // Find assessment by token
        const assessment = await prisma.assessment.findUnique({
            where: { token },
            include: {
                assessmentQuestions: {
                    include: {
                        question: {
                            select: {
                                id: true,
                                domain: true,
                                text: true,
                                helpText: true,
                                evidenceTypes: true,
                                category: true,
                            }
                        },
                        role: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                responses: {
                    select: {
                        questionId: true,
                    }
                }
            }
        });

        if (!assessment) {
            return NextResponse.json(
                { error: 'Assessment not found' },
                { status: 404 }
            );
        }

        // Check if assessment is expired
        if (assessment.deadline && new Date(assessment.deadline) < new Date()) {
            return NextResponse.json(
                { error: 'Assessment has expired' },
                { status: 410 }
            );
        }

        // Get answered question IDs
        const answeredQuestionIds = new Set(assessment.responses.map(r => r.questionId));

        // Build questions response
        const questions = assessment.assessmentQuestions.map(aq => ({
            id: aq.question.id,
            domain: aq.question.domain,
            text: aq.question.text,
            helpText: aq.question.helpText,
            category: aq.question.category,
            evidenceRequired: Array.isArray(aq.question.evidenceTypes)
                ? aq.question.evidenceTypes
                : [],
            assignedRole: aq.role?.name || 'Respondent',
            isAnswered: answeredQuestionIds.has(aq.question.id),
        }));

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error fetching partner assessment questions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
