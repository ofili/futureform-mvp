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

        const assessment = await prisma.assessment.create({
            data: {
                projectId: data.projectId,
                partnerName: data.partnerName,
                partnerAdminEmail: data.partnerAdminEmail,
                partnerGlobalId: data.partnerGlobalId,
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
                scores: true
            }
        });

        return this.transformAssessment(assessment);
    }

    /**
     * Delete assessment
     */
    async delete(id: string, userId: string) {
        logger.info('Deleting assessment', {
            service: 'AssessmentService',
            method: 'delete',
            assessmentId: id,
            userId,
        });

        // Verify access
        await this.getById(id, userId);

        await prisma.assessment.delete({
            where: { id }
        });

        return { success: true };
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
            partnerName: assessment.partnerName || 'Unknown Partner',
            partnerAdminEmail: assessment.partnerAdminEmail,
            type: assessment.type,
            depth: assessment.depth,
            deadline: assessment.deadline?.toISOString(),
            status: assessment.status,
            overallScore: assessment.overallScore,
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
}

// Export singleton instance
export const assessmentService = new AssessmentService();
