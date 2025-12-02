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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: projectId } = await params;
        const body = await request.json();
        const { type, depth, sector, deadline, aiConfig, partnerAdminEmail, partnerAliasId, partnerGlobalId, trustPartnerTypeId } = body;

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
        const isMember = project.organization?.members.some(
            (member) => member.userId === session.user.id
        ) ?? false;
        if (!isMember && project.createdById !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Resolve Partner Name for backward compatibility
        let partnerName = session.user.name || 'Unknown Partner';
        if (partnerAliasId) {
            const alias = await prisma.partnerAlias.findUnique({
                where: { id: partnerAliasId },
                select: { displayName: true }
            });
            if (alias) {
                partnerName = alias.displayName;
            }
        }

        // Check if this is a Trust Assessment
        if (body.trustPartnerTypeId) {
            // Fetch questions for the selected partner type
            const trustQuestions = await trustOntologyService.getQuestionsForPartnerType(body.trustPartnerTypeId);

            // Create assessment with trust fields
            const assessment = await prisma.assessment.create({
                data: {
                    projectId,
                    partnerId: session.user.id,
                    partnerName,
                    partnerType: 'Organization', // Default for now, or derive from trustPartnerType
                    partnerAliasId,
                    partnerGlobalId,
                    trustPartnerTypeId: body.trustPartnerTypeId,
                    status: 'PENDING',
                    token: generateToken(),
                    type,
                    depth,
                    deadline: deadline ? new Date(deadline) : null,
                    aiConfig: aiConfig || {},
                    partnerAdminEmail,
                    estimatedRespondents: 0,
                    estimatedDuration: calculateEstimatedDuration(depth),
                },
            });

            // Map trust questions to the format expected by the frontend
            // We do NOT create AssessmentQuestion records for Trust Assessments as they use a different schema
            const mappedQuestions = trustQuestions.map((q, index) => ({
                id: q.id, // Use trust question ID
                questionId: q.id,
                assessmentId: assessment.id,
                question: {
                    id: q.id,
                    text: q.text,
                    domain: q.subDimension?.name || 'Trust',
                },
                assignedRoleId: null, // To be mapped in wizard
                assignedSeniority: 'Manager',
                evidenceRequirements: q.evidenceRequired ? [q.evidenceRequired] : [],
                order: index + 1,
                aiConfidence: 1.0,
                aiRationale: 'Selected based on partner type',
                customized: false,
            }));

            return NextResponse.json(
                {
                    assessment: {
                        ...assessment,
                        questions: mappedQuestions,
                    },
                },
                { status: 201 }
            );
        }

        // Call AI service to select questions
        const selectedQuestions = await selectQuestions({
            sector,
            region: project.region || 'Global',
            assessmentType: type,
            depth,
            organizationSize: project.orgSize || 'Unknown',
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
                partnerName,
                partnerType: 'Organization',
                partnerAliasId,
                partnerGlobalId,
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
