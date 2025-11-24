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
                project: {
                    select: {
                        name: true,
                        description: true,
                    }
                },
                partner: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                responses: {
                    select: {
                        id: true,
                        questionId: true,
                        updatedAt: true,
                    }
                },
                assessmentQuestions: {
                    include: {
                        question: true,
                        role: true,
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

        // Calculate progress
        const totalQuestions = assessment.assessmentQuestions.length;
        const answeredQuestions = assessment.responses.length;
        const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

        // Get last saved timestamp
        const lastSaved = assessment.responses.length > 0
            ? assessment.responses.reduce((latest, response) =>
                response.updatedAt > latest ? response.updatedAt : latest,
                assessment.responses[0].updatedAt
            )
            : null;

        // Get user role information (from first assigned question)
        const userRole = assessment.assessmentQuestions[0]?.role;
        const assignedDomains = Array.from(new Set(
            assessment.assessmentQuestions.map(aq => aq.question.domain)
        ));

        // Build response
        const response = {
            project: {
                name: assessment.project.name,
                description: assessment.project.description || '',
            },
            assessment: {
                id: assessment.id,
                title: `Trust Diagnostic - ${assessment.partnerType}`,
                dueDate: assessment.deadline,
                estimatedDuration: assessment.estimatedDuration || 15,
                status: assessment.status,
            },
            partnerOrg: {
                name: assessment.partnerName,
            },
            userRole: {
                role: userRole?.name || 'Respondent',
                domains: assignedDomains,
                whySelected: `You were selected because your role provides critical expertise required for evaluating ${assignedDomains.join(', ')} in this deployment.`,
            },
            progress: {
                total: totalQuestions,
                answered: answeredQuestions,
                percentage,
                lastSaved,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching partner assessment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
