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
    partnerEmail?: string;
    partnerGlobalId?: string;
    partnerAliasId?: string;
    title?: string;
    description?: string;
}

export interface UpdateAssessmentInput {
    status?: AssessmentStatus;
    partnerName?: string;
    title?: string;
    description?: string;
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
        const hasAccess = assessment.project.organization.members.some(
            m => m.userId === userId && m.deletedAt === null
        );

        if (!hasAccess) {
            throw new Error('Unauthorized access to assessment');
        }

        return this.transformAssessment(assessment);
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

        const hasAccess = project.organization.members.some(
            m => m.userId === userId && m.deletedAt === null
        );

        if (!hasAccess) {
            throw new Error('Unauthorized access to project');
        }

        const assessment = await prisma.assessment.create({
            data: {
                projectId: data.projectId,
                partnerName: data.partnerName,
                partnerEmail: data.partnerEmail,
                partnerGlobalId: data.partnerGlobalId,
                partnerAliasId: data.partnerAliasId,
                title: data.title,
                description: data.description,
                status: AssessmentStatus.DRAFT,
                createdById: userId,
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
     * Delete assessment (soft delete)
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

        await prisma.assessment.update({
            where: { id },
            data: { deletedAt: new Date() }
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

        const [total, completed, inProgress, draft] = await Promise.all([
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    deletedAt: null
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: AssessmentStatus.COMPLETED,
                    deletedAt: null
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: AssessmentStatus.IN_PROGRESS,
                    deletedAt: null
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: AssessmentStatus.DRAFT,
                    deletedAt: null
                }
            }),
        ]);

        return { total, completed, inProgress, draft };
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
            partnerEmail: assessment.partnerEmail,
            title: assessment.title,
            description: assessment.description,
            status: assessment.status,
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
            deletedAt: assessment.deletedAt?.toISOString(),
        };
    }
}

// Export singleton instance
export const assessmentService = new AssessmentService();
