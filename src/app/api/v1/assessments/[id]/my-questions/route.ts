import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/assessments/[id]/my-questions
 * 
 * Get questions assigned to the current user for an assessment
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: assessmentId } = await params;

        // 1. Try finding AssessmentRespondent (NEW Flow)
        const respondent = await prisma.assessmentRespondent.findFirst({
            where: {
                assessmentPartner: { assessmentId },
                userId: session.user.id
            },
            include: {
                assessmentPartner: {
                    include: { assessment: true }
                }
            }
        });

        let assessment;
        let questions = [];
        let invitation = null;

        if (respondent) {
            assessment = respondent.assessmentPartner.assessment;

            if (assessment.trustPartnerTypeId) {
                // Trust Flow: Fetch from TrustPartnerTypeQuestion
                const trustQuestions = await prisma.trustPartnerTypeQuestion.findMany({
                    where: {
                        partnerTypeId: assessment.trustPartnerTypeId,
                        assignedRole: respondent.role
                    },
                    include: {
                        question: { include: { subDimension: true } }
                    },
                    // orderBy: { question: { questionId: 'asc' } } // Optional ordering
                });

                questions = trustQuestions.map(tq => ({
                    id: tq.id,
                    questionId: tq.questionId, // TrustQuestion ID
                    role: { name: tq.assignedRole },
                    question: {
                        id: tq.question.id,
                        text: tq.question.text,
                        domain: tq.question.subDimension.name,
                        // evidenceGuidance can be complex, map as needed. 
                        // Assuming evidenceGuidance has a 'types' array or similar, or mapping evidenceRequired text.
                        evidenceRequirements: (tq.question.evidenceGuidance as any)?.types || [],
                        detailedExplanation: tq.question.detailedExplanation,
                        evidenceGuidance: tq.question.evidenceGuidance,
                        helpText: tq.question.evidenceRequired // Mapping evidenceRequired text to helpText for visibility
                    }
                }));

                // Fetch Sector-Based Questions (Dynamic merge)
                const context = assessment.trustDeploymentContext as any;
                if (context?.sector) {
                    const sectorQs = await trustOntologyService.getQuestionsBySector(context.sector);

                    // Filter: Only show sector questions if they match the respondent's role (assuming default 'Manager')
                    // OR if we want to show them to everyone? User requirement "System assigns roles".
                    // Let's assume 'Manager' is the default role for these.
                    if (respondent.role === 'Manager') {
                        const mappedSectorQs = sectorQs.map(q => ({
                            id: q.id, // Using Question ID as 'id' since no PartnerTypeQuestion entry exists
                            questionId: q.id,
                            role: { name: 'Manager' },
                            question: {
                                id: q.id,
                                text: q.text,
                                domain: q.subDimension.name,
                                evidenceRequirements: (q.evidenceGuidance as any)?.types || [],
                                detailedExplanation: q.detailedExplanation,
                                evidenceGuidance: q.evidenceGuidance,
                                helpText: q.evidenceRequired
                            }
                        }));

                        // Merge avoiding duplicates (by questionId)
                        const existingIds = new Set(questions.map(q => q.questionId));
                        for (const q of mappedSectorQs) {
                            if (!existingIds.has(q.questionId)) {
                                questions.push(q);
                            }
                        }
                    }
                }
            } else {
                // Standard Flow (using AssessmentQuestion but with string role logic if needed)
                // For now, if no trustPartnerTypeId, we might not have questions if using string roles on AssessmentQuestion.
                // Fallback to fetching all questions or based on some mapping?
                // Existing AssessmentQuestion uses assignedRoleId (String ID). Respondent has role (String Name).
                // We might skip for now or fetch all.
                const assessmentQuestions = await prisma.assessmentQuestion.findMany({
                    where: { assessmentId }, // Fetch all for now if mapping is unclear, or filter client side
                    include: { question: true, role: true },
                    orderBy: { order: 'asc' }
                });
                // Filter by role name if possible
                questions = assessmentQuestions.filter(aq => !aq.assignedRoleId || aq.role?.name === respondent.role)
                    .map(aq => ({
                        ...aq,
                        question: {
                            ...aq.question,
                            type: 'LIKERT' // Default
                        }
                    }));
            }

        } else {
            // 2. Fallback to Legacy Invitation (OLD Flow)
            invitation = await prisma.assessmentInvitation.findFirst({
                where: {
                    assessmentId,
                    userId: session.user.id,
                    status: 'ACCEPTED',
                },
                include: { role: true },
            });

            if (!invitation) {
                return NextResponse.json({ error: 'No invitation found' }, { status: 404 });
            }

            assessment = await prisma.assessment.findUnique({
                where: { id: assessmentId },
                include: { project: { select: { name: true, description: true } } }
            });

            // Get questions assigned to user's role
            questions = await prisma.assessmentQuestion.findMany({
                where: {
                    assessmentId,
                    OR: [
                        { assignedRoleId: invitation.roleId },
                        { assignedRoleId: null },
                    ],
                },
                include: {
                    question: true,
                    role: true,
                },
                orderBy: { order: 'asc' },
            });
        }

        return NextResponse.json(
            {
                assessment,
                questions,
                invitation,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching assigned questions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
