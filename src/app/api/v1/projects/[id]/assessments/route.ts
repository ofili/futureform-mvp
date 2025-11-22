import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { selectQuestions } from '@/lib/services/ai-question-selector';

/**
 * POST /api/v1/projects/[id]/assessments
 * 
 * Create a new assessment with AI-selected questions
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projectId = params.id;
        const body = await request.json();
        const { type, depth, sector, deadline, aiConfig, partnerAdminEmail } = body;

        // Validate required fields
        if (!type || !depth || !sector) {
            return NextResponse.json(
                { error: 'Missing required fields: type, depth, sector' },
                { status: 400 }
            );
        }

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { organization: { include: { members: true } } },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check if user has access to this project
        const isMember = project.organization.members.some(
            (member) => member.userId === session.user.id
        );
        if (!isMember && project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Call AI service to select questions
        const selectedQuestions = await selectQuestions({
            sector,
            region: project.region || 'Global',
            assessmentType: type,
            depth,
            organizationSize: project.organization.size,
            attachedDocs: aiConfig?.attachedDocs || [],
        });

        // Fetch actual question IDs from database
        // For now, we'll get questions from the database based on domain
        const questions = await prisma.question.findMany({
            take: selectedQuestions.length,
            orderBy: { order: 'asc' },
        });

        if (questions.length === 0) {
            return NextResponse.json(
                { error: 'No questions available in the database' },
                { status: 500 }
            );
        }

        // Create assessment
        const assessment = await prisma.assessment.create({
            data: {
                projectId,
                partnerId: session.user.id,
                partnerName: `${session.user.firstName} ${session.user.lastName}`,
                partnerType: 'Organization',
                status: 'PENDING',
                token: generateToken(),
                type,
                depth,
                deadline: deadline ? new Date(deadline) : null,
                aiConfig: aiConfig || {},
                partnerAdminEmail,
                estimatedRespondents: 0, // Will be updated when invitations are sent
                estimatedDuration: calculateEstimatedDuration(depth),
            },
        });

        // Create AssessmentQuestion records
        const assessmentQuestions = await Promise.all(
            selectedQuestions.map(async (sq, index) => {
                // Map the mock question ID to actual question from DB
                const question = questions[index % questions.length];

                // Find role by name
                const role = await prisma.role.findFirst({
                    where: { name: sq.suggestedRole },
                });

                return prisma.assessmentQuestion.create({
                    data: {
                        assessmentId: assessment.id,
                        questionId: question.id,
                        assignedRoleId: role?.id || null,
                        assignedSeniority: sq.suggestedSeniority,
                        evidenceRequirements: sq.suggestedEvidence,
                        order: index + 1,
                        aiConfidence: sq.confidence,
                        aiRationale: sq.rationale,
                        customized: false,
                    },
                    include: {
                        question: true,
                        role: true,
                    },
                });
            })
        );

        return NextResponse.json(
            {
                assessment: {
                    ...assessment,
                    questions: assessmentQuestions,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating assessment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Generate a unique token for assessment invitation
 */
function generateToken(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

/**
 * Calculate estimated duration based on depth
 */
function calculateEstimatedDuration(depth: string): number {
    const durations = {
        quick: 30, // 30 minutes
        standard: 60, // 1 hour
        deep: 120, // 2 hours
    };
    return durations[depth as keyof typeof durations] || 60;
}
