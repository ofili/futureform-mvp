import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { selectQuestions, saveSelectionToAssessment } from '@/lib/services/ai-question-selector';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

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

        // Force Depth to 'deep' as per new requirements
        const forcedDepth = 'deep';
        const estimatedDuration = calculateEstimatedDuration(forcedDepth);

        // Check if this is a Trust Assessment
        if (body.trustPartnerTypeId) {
            // Fetch partner type to derive partnerType
            const partnerTypeDetails = await trustOntologyService.getPartnerTypeById(body.trustPartnerTypeId);
            if (!partnerTypeDetails) {
                return NextResponse.json({ error: 'Partner type not found' }, { status: 404 });
            }

            // Fetch questions for the selected partner type (Template)
            // functionality getQuestionsForPartnerType returns TrustQuestion array.
            // We need mapping info (assignedRole) from TrustPartnerTypeQuestion.
            // trustOntologyService.getQuestionsForPartnerType returns questions, but we lose the Relation info.
            // We should update the service or fetch raw here.
            // For now, let's assume we update the service or fetch broadly.

            // NOTE: To get assignedRole, we really need the intermediate definition. 
            // Let's modify logic to fetch TrustPartnerTypeQuestion directly.
            const partnerTypeQuestions = await prisma.trustPartnerTypeQuestion.findMany({
                where: { partnerTypeId: body.trustPartnerTypeId },
                include: {
                    question: {
                        include: { subDimension: true }
                    }
                },
                orderBy: { question: { questionId: 'asc' } }
            });

            // Derive partnerType from ontology
            const derivedPartnerType = partnerTypeDetails.name;

            // Create assessment with trust fields
            const assessment = await prisma.assessment.create({
                data: {
                    projectId,
                    partnerId: session.user.id,
                    partnerName,
                    partnerType: derivedPartnerType,
                    partnerAliasId,
                    partnerGlobalId,
                    trustPartnerTypeId: body.trustPartnerTypeId,
                    status: 'PENDING',
                    token: generateToken(),
                    type,
                    depth: forcedDepth,
                    deadline: deadline ? new Date(deadline) : null,
                    aiConfig: aiConfig || {},
                    partnerAdminEmail,
                    estimatedRespondents: 0,
                    estimatedDuration,
                    trustDeploymentContext: { sector }, // Save sector context
                },
            });

            // Map trust questions + assignedRole
            const mappedQuestions = partnerTypeQuestions.map((ptq, index) => ({
                id: ptq.question.id,
                questionId: ptq.question.id, // Using TrustQuestion ID
                assessmentId: assessment.id,
                question: {
                    id: ptq.question.id,
                    text: ptq.question.text,
                    domain: ptq.question.subDimension?.name || 'Trust',
                },
                assignedRoleId: ptq.assignedRole || 'Manager', // Auto-assign role from Template
                assignedSeniority: 'Manager',
                evidenceRequirements: ptq.question.evidenceRequired ? [ptq.question.evidenceRequired] : [],
                order: index + 1,
                aiConfidence: 1.0,
                aiRationale: 'Selected based on partner type template',
                customized: false,
            }));

            // Fetch Sector-Based Questions
            let allQuestions = [...mappedQuestions];

            if (sector) {
                const sectorQs = await trustOntologyService.getQuestionsBySector(sector);
                const mappedSectorQs = sectorQs.map((q, index) => ({
                    id: q.id,
                    questionId: q.id,
                    assessmentId: assessment.id,
                    question: {
                        id: q.id,
                        text: q.text,
                        domain: q.subDimension?.name || 'Trust',
                    },
                    assignedRoleId: 'Manager', // Default role for sector questions
                    assignedSeniority: 'Manager',
                    evidenceRequirements: q.evidenceRequired ? [q.evidenceRequired] : [],
                    order: mappedQuestions.length + index + 1,
                    aiConfidence: 1.0,
                    aiRationale: `Selected based on sector: ${sector}`,
                    customized: false,
                }));

                // Merge unique questions (avoid duplicates if question is already in template)
                // Use a map or filter
                const existingIds = new Set(allQuestions.map(q => q.questionId));
                for (const q of mappedSectorQs) {
                    if (!existingIds.has(q.questionId)) {
                        allQuestions.push(q);
                    }
                }
            }

            return NextResponse.json(
                {
                    assessment: {
                        ...assessment,
                        questions: allQuestions,
                    },
                },
                { status: 201 }
            );
        }

        // Generic Assessment Flow (Fallback) with forced depth
        const selectionResult = await selectQuestions({
            sector,
            region: project.region || 'Global',
            assessmentType: type,
            depth: forcedDepth,
            organizationSize: project.orgSize || 'Unknown',
            attachedDocs: aiConfig?.attachedDocs || [],
        });

        if (selectionResult.questions.length === 0) {
            return NextResponse.json(
                { error: 'No questions available matching criteria' },
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
                depth: forcedDepth,
                deadline: deadline ? new Date(deadline) : null,
                aiConfig: aiConfig || {},
                partnerAdminEmail,
                estimatedRespondents: 0, // Will be updated when invitations are sent
                estimatedDuration: calculateEstimatedDuration(forcedDepth),
            },
        });

        // Save selected questions to assessment using service layer
        const assessmentQuestions = await saveSelectionToAssessment(
            assessment.id,
            selectionResult
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
