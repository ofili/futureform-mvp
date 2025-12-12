// Assessment Service
// Handles all assessment-related operations

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { AssessmentStatus, Prisma } from '@prisma/client';

export interface AssessmentFilters {
    projectId?: string;
    status?: AssessmentStatus;
    partnerId?: string;
    limit?: number;
    offset?: number;
}

export interface CreateAssessmentInput {
    projectId: string;
    partnerName?: string;
    partnerAdminEmail?: string;
    partnerGlobalId?: string;
    partnerAliasId?: string;
    type?: string;
    depth?: string;
    deadline?: Date;
}

export interface UpdateAssessmentInput {
    status?: AssessmentStatus;
    partnerName?: string;
    type?: string;
    depth?: string;
    deadline?: Date;
}

export class AssessmentService {
    /**
     * Get assessment by ID with authorization check
     */
    async getById(id: string, userId: string) {
        logger.info('Fetching assessment', {
            service: 'AssessmentService',
            method: 'getById',
            assessmentId: id,
            userId,
        });

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                project: {
                    include: {
                        organization: {
                            include: { members: true }
                        }
                    }
                },
                trustPartnerType: {
                    select: { name: true }
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
            throw new Error('Assessment not found');
        }

        // Authorization check
        const hasAccess = assessment.project.organization?.members.some(
            m => m.userId === userId && m.deletedAt === null
        ) ?? false;

        if (!hasAccess) {
            throw new Error('Unauthorized access to assessment');
        }

        return this.transformAssessment(assessment);
    }

    /**
     * Get assessment with strict authorization check (for internal use)
     */
    async getAssessmentWithAuth(assessmentId: string, userId: string, userRole: string) {
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: {
                    include: {
                        organization: {
                            include: { members: true }
                        }
                    }
                },
                invitations: true,
                responses: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        if (!assessment) {
            return null;
        }

        // Authorization check
        if (userRole === 'ADMIN') {
            return assessment;
        }

        // Check if user is a member of the project's organization
        const isOrgMember = assessment.project.organization?.members.some(
            m => m.userId === userId && m.deletedAt === null
        ) ?? false;

        if (!isOrgMember) {
            throw new Error('Forbidden: You do not have access to this assessment');
        }

        return assessment;
    }

    /**
     * Submit assessment responses
     */
    async submitResponses(assessmentId: string, userId: string, responses: any[]) {
        // Verify access first
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: {
                    include: {
                        organization: {
                            include: { members: true }
                        }
                    }
                }
            }
        });

        if (!assessment) {
            throw new Error('Assessment not found');
        }

        const isOrgMember = assessment.project.organization?.members.some(
            m => m.userId === userId && m.deletedAt === null
        ) ?? false;

        if (!isOrgMember) {
            throw new Error('Forbidden: You do not have access to this assessment');
        }

        // Use transaction to save all responses
        await prisma.$transaction(
            responses.map((r: any) =>
                prisma.assessmentResponse.upsert({
                    where: {
                        assessmentId_questionId: {
                            assessmentId,
                            questionId: r.questionId
                        }
                    },
                    update: {
                        response: r.response,
                        evidenceFiles: r.evidenceFiles,
                        updatedAt: new Date(),
                        userId // Update last editor
                    },
                    create: {
                        assessmentId,
                        questionId: r.questionId,
                        userId,
                        response: r.response,
                        evidenceFiles: r.evidenceFiles
                    }
                })
            )
        );

        // Update assessment status to IN_PROGRESS if not already
        if (assessment.status === AssessmentStatus.PENDING || assessment.status === AssessmentStatus.DRAFT) {
            await prisma.assessment.update({
                where: { id: assessmentId },
                data: { status: AssessmentStatus.IN_PROGRESS }
            });
        }

        return { success: true };
    }

    /**
     * List assessments with filters and authorization
     */
    async list(userId: string, filters: AssessmentFilters = {}) {
        logger.info('Listing assessments', {
            service: 'AssessmentService',
            method: 'list',
            userId,
            filters,
        });

        // Get user's organizations
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = userOrgs.map(o => o.organizationId);

        const assessments = await prisma.assessment.findMany({
            where: {
                project: {
                    organizationId: { in: orgIds }
                },
                ...(filters.projectId && { projectId: filters.projectId }),
                ...(filters.status && { status: filters.status }),
            },
            include: {
                project: {
                    select: { id: true, name: true }
                },
                trustPartnerType: {
                    select: { name: true }
                },
                scores: true
            },
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 50,
            skip: filters.offset || 0,
        });

        return assessments.map(a => this.transformAssessment(a));
    }

    /**
     * Create new assessment
     */
    async create(data: CreateAssessmentInput, userId: string) {
        logger.info('Creating assessment', {
            service: 'AssessmentService',
            method: 'create',
            userId,
            projectId: data.projectId,
        });

        // Verify project access
        const project = await prisma.project.findUnique({
            where: { id: data.projectId },
            include: {
                organization: {
                    include: { members: true }
                }
            }
        });

        if (!project) {
            throw new Error('Project not found');
        }

        const hasAccess = project.organization?.members.some(
            m => m.userId === userId && m.deletedAt === null
        ) ?? false;

        if (!hasAccess) {
            throw new Error('Unauthorized access to project');
        }

        // Resolve Partner IDs
        let partnerGlobalId = data.partnerGlobalId;
        let partnerName = data.partnerName;

        if (data.partnerAliasId) {
            const alias = await prisma.partnerAlias.findUnique({
                where: { id: data.partnerAliasId },
                include: { partner: true }
            });

            if (alias) {
                partnerGlobalId = alias.partnerId;
                // Prefer alias display name, fallback to global legal name
                partnerName = alias.displayName || alias.partner.legalName;
            }
        }

        const assessment = await prisma.assessment.create({
            data: {
                projectId: data.projectId,
                partnerName: partnerName,
                partnerAdminEmail: data.partnerAdminEmail,
                partnerGlobalId: partnerGlobalId,
                partnerAliasId: data.partnerAliasId,
                type: data.type,
                depth: data.depth,
                deadline: data.deadline,
                status: AssessmentStatus.PENDING,
                token: crypto.randomUUID(), // Generate unique token
            },
            include: {
                project: {
                    select: { id: true, name: true }
                }
            }
        });

        return this.transformAssessment(assessment);
    }

    /**
     * Update assessment
     */
    async update(id: string, data: UpdateAssessmentInput, userId: string) {
        logger.info('Updating assessment', {
            service: 'AssessmentService',
            method: 'update',
            assessmentId: id,
            userId,
        });

        // Verify access
        await this.getById(id, userId);

        const assessment = await prisma.assessment.update({
            where: { id },
            data,
            include: {
                project: {
                    select: { id: true, name: true }
                },
                trustPartnerType: {
                    select: { name: true }
                },
                scores: true
            }
        });

        return this.transformAssessment(assessment);
    }

    /**
     * Delete/remove partner from assessment
     * Only org admin or assessment creator can remove
     * Sends email notification if partner had accepted the invite
     */
    async removePartnerFromAssessment(
        assessmentId: string,
        userId: string,
        userOrgRole?: string
    ): Promise<{ success: boolean; emailSent: boolean }> {
        logger.info('Removing partner from assessment', {
            service: 'AssessmentService',
            method: 'removePartnerFromAssessment',
            assessmentId,
            userId,
        });

        // Fetch assessment with project and organization details
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: {
                    include: {
                        organization: {
                            include: { members: true }
                        },
                        createdBy: true
                    }
                }
            }
        });

        if (!assessment) {
            throw new Error('Assessment not found');
        }

        // Authorization: Check if user is org admin or assessment/project creator
        const membership = assessment.project.organization?.members.find(
            m => m.userId === userId && m.deletedAt === null
        );

        const isOrgAdmin = membership?.role === 'ADMIN' || membership?.role === 'OWNER';
        const isProjectCreator = assessment.project.createdById === userId;
        const isAssessmentCreator = assessment.partnerId === userId; // partnerId might be the creator

        if (!isOrgAdmin && !isProjectCreator && !isAssessmentCreator) {
            throw new Error('Forbidden: Only organization admins or the assessment creator can remove partners');
        }

        // Check if partner has accepted (status is not PENDING)
        const partnerHasAccepted = assessment.status !== 'PENDING';
        let emailSent = false;

        // If partner accepted, send notification email
        if (partnerHasAccepted && assessment.partnerAdminEmail) {
            try {
                const { sendEmail } = await import('@/lib/email');
                await sendEmail({
                    to: assessment.partnerAdminEmail,
                    subject: `Assessment Invitation Cancelled - ${assessment.project.name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Assessment Invitation Cancelled</h2>
                            <p>Dear ${assessment.partnerName || 'Partner'},</p>
                            <p>We regret to inform you that your assessment invitation for the project <strong>${assessment.project.name}</strong> has been cancelled.</p>
                            <p>If you have any questions, please contact the project team.</p>
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                                    This email was sent by Gitance.
                                </p>
                            </div>
                        </div>
                    `,
                });
                emailSent = true;
                logger.info('Removal notification email sent', {
                    service: 'AssessmentService',
                    method: 'removePartnerFromAssessment',
                    assessmentId,
                    partnerEmail: assessment.partnerAdminEmail,
                });
            } catch (emailError) {
                logger.error('Failed to send removal notification email', emailError as Error, {
                    service: 'AssessmentService',
                    method: 'removePartnerFromAssessment',
                });
                // Don't fail the delete operation if email fails
            }
        }

        // Delete the assessment
        await prisma.assessment.delete({
            where: { id: assessmentId }
        });

        return { success: true, emailSent };
    }

    /**
     * Delete assessment (legacy method - delegates to removePartnerFromAssessment)
     */
    async delete(id: string, userId: string) {
        return this.removePartnerFromAssessment(id, userId);
    }

    /**
     * Get assessment statistics
     */
    async getStats(userId: string) {
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = userOrgs.map(o => o.organizationId);

        const [total, completed, inProgress, pending] = await Promise.all([
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } }
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: AssessmentStatus.COMPLETED
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: AssessmentStatus.IN_PROGRESS
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: AssessmentStatus.PENDING
                }
            }),
        ]);

        return { total, completed, inProgress, pending };
    }

    /**
     * Transform assessment for client
     */
    private transformAssessment(assessment: any) {
        return {
            id: assessment.id,
            projectId: assessment.projectId,
            project: assessment.project,
            // Convenience field for list views
            projectName: assessment.project?.name || 'Unknown Project',
            partnerName: assessment.partnerName || 'Unknown Partner',
            partnerAdminEmail: assessment.partnerAdminEmail,
            partnerAliasId: assessment.partnerAliasId,
            partnerGlobalId: assessment.partnerGlobalId,

            type: assessment.trustPartnerType?.name || assessment.type,
            originalType: assessment.type,
            depth: assessment.depth,
            deadline: assessment.deadline?.toISOString(),
            status: assessment.status?.toLowerCase() || 'pending',
            overallScore: assessment.overallScore,
            // Alias for list views
            trustScore: assessment.overallScore,
            confidenceLevel: assessment.confidenceLevel,
            domainScores: assessment.scores?.map((s: any) => ({
                domain: s.domain,
                score: s.score,
                confidence: s.confidence
            })) || [],
            responses: assessment.responses?.map((r: any) => ({
                question: r.question,
                response: r.response
            })) || [],
            redFlags: assessment.redFlags?.map((f: any) => ({
                description: f.description,
                severity: f.severity
            })) || [],
            createdAt: assessment.createdAt?.toISOString(),
            completedAt: assessment.completedAt?.toISOString(),
            updatedAt: assessment.updatedAt?.toISOString(),
        };
    }

    /**
     * Save assessment draft
     */
    async saveDraft(assessmentId: string, questionId: string, draftData: any) {
        // Validation handled by caller or schema
        const draft = await prisma.assessmentDraft.upsert({
            where: {
                assessmentId_questionId: {
                    assessmentId,
                    questionId,
                },
            },
            update: {
                draftData: JSON.stringify(draftData),
                lastSaved: new Date(),
            },
            create: {
                assessmentId,
                questionId,
                draftData: JSON.stringify(draftData),
                lastSaved: new Date(),
                isSubmitted: false, // Default
            },
        });
        return draft;
    }

    /**
     * Get assessment drafts
     */
    async getDrafts(assessmentId: string) {
        return prisma.assessmentDraft.findMany({
            where: { assessmentId },
            select: {
                questionId: true,
                draftData: true,
                lastSaved: true
            }
        });
    }

    /**
     * Create project assessment with AI-selected questions
     * Handles both Trust Assessment and Generic Assessment flows
     */
    async createProjectAssessmentWithQuestions(
        projectId: string,
        userId: string,
        input: {
            type: string;
            depth: string;
            sector: string;
            deadline?: Date | string;
            aiConfig?: any;
            partnerAdminEmail?: string;
            partnerAliasId?: string;
            partnerGlobalId?: string;
            trustPartnerTypeId?: string;
        }
    ) {
        logger.info('Creating project assessment with questions', {
            service: 'AssessmentService',
            method: 'createProjectAssessmentWithQuestions',
            userId,
            projectId,
            type: input.type,
        });

        // Import required services dynamically to avoid circular deps
        const { selectQuestions, saveSelectionToAssessment } = await import('@/lib/services/ai-question-selector');
        const { trustOntologyService } = await import('@/lib/services/trust-ontology.service');

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { organization: { include: { members: true } } },
        });

        if (!project) {
            throw new Error('Project not found');
        }

        // Check if user has access to this project
        const isMember = project.organization?.members.some(
            (member) => member.userId === userId && member.deletedAt === null
        ) ?? false;
        if (!isMember && project.createdById !== userId) {
            throw new Error('Forbidden');
        }

        // Resolve Partner Name for backward compatibility
        let partnerName = 'Unknown Partner';
        if (input.partnerAliasId) {
            const alias = await prisma.partnerAlias.findUnique({
                where: { id: input.partnerAliasId },
                select: { displayName: true }
            });
            if (alias) {
                partnerName = alias.displayName;
            }
        }

        // Force Depth to 'deep' as per requirements
        const forcedDepth = 'deep';
        const estimatedDuration = this.calculateEstimatedDuration(forcedDepth);

        // Generate unique token
        const token = this.generateToken();

        // Trust Assessment Flow
        if (input.trustPartnerTypeId) {
            const partnerTypeDetails = await trustOntologyService.getPartnerTypeById(input.trustPartnerTypeId);
            if (!partnerTypeDetails) {
                throw new Error('Partner type not found');
            }

            // Fetch questions for the partner type
            const partnerTypeQuestions = await prisma.trustPartnerTypeQuestion.findMany({
                where: { partnerTypeId: input.trustPartnerTypeId },
                include: {
                    question: {
                        include: { subDimension: true }
                    }
                },
                orderBy: { question: { questionId: 'asc' } }
            });

            const derivedPartnerType = partnerTypeDetails.name;

            // Create assessment
            const assessment = await prisma.assessment.create({
                data: {
                    projectId,
                    partnerId: userId,
                    partnerName,
                    partnerType: derivedPartnerType,
                    partnerAliasId: input.partnerAliasId,
                    partnerGlobalId: input.partnerGlobalId,
                    trustPartnerTypeId: input.trustPartnerTypeId,
                    status: 'PENDING',
                    token,
                    type: input.type,
                    depth: forcedDepth,
                    deadline: input.deadline ? new Date(input.deadline as string) : null,
                    aiConfig: input.aiConfig || {},
                    partnerAdminEmail: input.partnerAdminEmail,
                    estimatedRespondents: 0,
                    estimatedDuration,
                    trustDeploymentContext: { sector: input.sector },
                },
            });

            // Map trust questions + assignedRole
            const mappedQuestions = partnerTypeQuestions.map((ptq, index) => ({
                id: ptq.question.id,
                questionId: ptq.question.id,
                assessmentId: assessment.id,
                question: {
                    id: ptq.question.id,
                    text: ptq.question.text,
                    domain: ptq.question.subDimension?.name || 'Trust',
                },
                assignedRoleId: ptq.assignedRole || 'Manager',
                assignedSeniority: 'Manager',
                evidenceRequirements: ptq.question.evidenceRequired ? [ptq.question.evidenceRequired] : [],
                order: index + 1,
                aiConfidence: 1.0,
                aiRationale: 'Selected based on partner type template',
                customized: false,
            }));

            // Fetch Sector-Based Questions
            let allQuestions = [...mappedQuestions];

            if (input.sector) {
                const sectorQs = await trustOntologyService.getQuestionsBySector(input.sector);
                const mappedSectorQs = sectorQs.map((q, index) => ({
                    id: q.id,
                    questionId: q.id,
                    assessmentId: assessment.id,
                    question: {
                        id: q.id,
                        text: q.text,
                        domain: q.subDimension?.name || 'Trust',
                    },
                    assignedRoleId: 'Manager',
                    assignedSeniority: 'Manager',
                    evidenceRequirements: q.evidenceRequired ? [q.evidenceRequired] : [],
                    order: mappedQuestions.length + index + 1,
                    aiConfidence: 1.0,
                    aiRationale: `Selected based on sector: ${input.sector}`,
                    customized: false,
                }));

                // Merge unique questions
                const existingIds = new Set(allQuestions.map(q => q.questionId));
                for (const q of mappedSectorQs) {
                    if (!existingIds.has(q.questionId)) {
                        allQuestions.push(q);
                    }
                }
            }

            return {
                assessment: {
                    ...assessment,
                    questions: allQuestions,
                },
            };
        }

        // Generic Assessment Flow (Fallback) with forced depth
        const selectionResult = await selectQuestions({
            sector: input.sector,
            region: project.region || 'Global',
            assessmentType: input.type,
            depth: forcedDepth,
            organizationSize: project.orgSize || 'Unknown',
            attachedDocs: input.aiConfig?.attachedDocs || [],
        });

        if (selectionResult.questions.length === 0) {
            throw new Error('No questions available matching criteria');
        }

        // Create assessment
        const assessment = await prisma.assessment.create({
            data: {
                projectId,
                partnerId: userId,
                partnerName,
                partnerType: 'Organization',
                partnerAliasId: input.partnerAliasId,
                partnerGlobalId: input.partnerGlobalId,
                status: 'PENDING',
                token,
                type: input.type,
                depth: forcedDepth,
                deadline: input.deadline ? new Date(input.deadline as string) : null,
                aiConfig: input.aiConfig || {},
                partnerAdminEmail: input.partnerAdminEmail,
                estimatedRespondents: 0,
                estimatedDuration,
            },
        });

        // Save selected questions to assessment
        const assessmentQuestions = await saveSelectionToAssessment(
            assessment.id,
            selectionResult
        );

        return {
            assessment: {
                ...assessment,
                questions: assessmentQuestions,
            },
        };
    }

    /**
     * Generate a unique token for assessment invitation
     */
    private generateToken(): string {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    /**
     * Calculate estimated duration based on depth
     */
    private calculateEstimatedDuration(depth: string): number {
        const durations: Record<string, number> = {
            quick: 30,
            standard: 60,
            deep: 120,
        };
        return durations[depth] || 60;
    }
}

// Export singleton instance
export const assessmentService = new AssessmentService();
