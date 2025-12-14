// Project Service
// Handles all project-related operations

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { ProjectStatus, Prisma } from '@prisma/client';

export interface ProjectFilters {
    organizationId?: string;
    status?: ProjectStatus;
    search?: string;
    type?: string;
    sector?: string;
    region?: string;
    budgetRange?: string;
    limit?: number;
    offset?: number;
}

export interface CreateProjectInput {
    name: string;
    description?: string;
    organizationId: string;
    type: string;
    sector: string;
    subsector?: string;
    region: string;
    country?: string;
    orgSize?: string;
    budgetRange?: string;
    timeline?: string;
    objectives?: string;
    longDescription?: string;
    stakeholders?: string;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    type?: string;
    sector?: string;
    subsector?: string;
    region?: string;
    country?: string;
    orgSize?: string;
    budgetRange?: string;
    timeline?: string;
    objectives?: string;
    longDescription?: string;
    stakeholders?: string;
}

export class ProjectService {
    /**
     * Get project by ID with authorization
     */
    async getById(id: string, userId: string) {
        logger.info('Fetching project', {
            service: 'ProjectService',
            method: 'getById',
            projectId: id,
            userId,
        });

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                organization: {
                    include: { members: true }
                },
                assessments: {
                    select: {
                        id: true,
                        partnerName: true,
                        status: true,
                        type: true,
                        createdAt: true,
                        scores: {
                            select: {
                                domain: true,
                                score: true
                            }
                        },
                        trustPartnerType: {
                            select: {
                                name: true
                            }
                        },
                        assessmentPartners: {
                            select: {
                                id: true,
                                status: true
                            }
                        }
                    }
                },
                teamMembers: {
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

        if (!project) {
            throw new Error('Project not found');
        }

        // Admin can access any project
        if (user?.role === 'ADMIN') {
            return this.transformProject(project);
        }

        // Project creator always has access
        if ((project as any).createdById === userId) {
            return this.transformProject(project);
        }

        // Authorization check - user must be org member
        const hasAccess = project.organization?.members.some(
            m => m.userId === userId && m.deletedAt === null
        ) ?? false;

        if (!hasAccess) {
            throw new Error('Unauthorized access to project');
        }

        return this.transformProject(project);
    }

    /**
     * List projects with filters
     */
    async list(userId: string, filters: ProjectFilters = {}) {
        logger.info('Listing projects', {
            service: 'ProjectService',
            method: 'list',
            userId,
            filters,
        });

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        // Get user's organizations
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = userOrgs.map(o => o.organizationId);

        // Build where clause based on user role
        let where: Prisma.ProjectWhereInput;

        if (user?.role === 'ADMIN') {
            // Admin can see all projects
            where = {
                ...(filters.organizationId && { organizationId: filters.organizationId }),
                ...(filters.status && { status: filters.status }),
                ...(filters.type && { type: filters.type }),
                ...(filters.sector && { sector: filters.sector }),
                ...(filters.region && { region: filters.region }),
                ...(filters.budgetRange && { budgetRange: filters.budgetRange }),
                ...(filters.search && {
                    OR: [
                        { name: { contains: filters.search, mode: 'insensitive' } },
                        { description: { contains: filters.search, mode: 'insensitive' } }
                    ]
                }),
            };
        } else {
            // Regular user: see projects from their orgs OR projects they created
            where = {
                OR: [
                    { organizationId: { in: orgIds } },
                    { createdById: userId }
                ],
                ...(filters.organizationId && { organizationId: filters.organizationId }),
                ...(filters.status && { status: filters.status }),
                ...(filters.type && { type: filters.type }),
                ...(filters.sector && { sector: filters.sector }),
                ...(filters.region && { region: filters.region }),
                ...(filters.budgetRange && { budgetRange: filters.budgetRange }),
                ...(filters.search && {
                    AND: [{
                        OR: [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { description: { contains: filters.search, mode: 'insensitive' } }
                        ]
                    }]
                }),
            };
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                organization: {
                    select: { id: true, name: true }
                },
                _count: {
                    select: { assessments: true }
                },
                assessments: {
                    select: { id: true, status: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 50,
            skip: filters.offset || 0,
        });

        return projects.map(p => this.transformProject(p));
    }

    /**
     * Create new project
     */
    async create(data: CreateProjectInput, userId: string) {
        logger.info('Creating project', {
            service: 'ProjectService',
            method: 'create',
            userId,
            organizationId: data.organizationId,
        });

        // Verify organization access
        const orgMember = await prisma.organizationMember.findFirst({
            where: {
                organizationId: data.organizationId,
                userId,
                deletedAt: null
            }
        });

        if (!orgMember) {
            throw new Error('Unauthorized access to organization');
        }

        const project = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                organizationId: data.organizationId,
                type: data.type,
                sector: data.sector,
                subsector: data.subsector,
                region: data.region,
                country: data.country,
                orgSize: data.orgSize,
                budgetRange: data.budgetRange,
                timeline: data.timeline,
                objectives: data.objectives,
                longDescription: data.longDescription,
                stakeholders: data.stakeholders,
                status: ProjectStatus.PLANNING,
                createdById: userId,
            },
            include: {
                organization: {
                    select: { id: true, name: true }
                }
            }
        });

        return this.transformProject(project);
    }

    /**
     * Update project
     */
    async update(id: string, data: UpdateProjectInput, userId: string) {
        logger.info('Updating project', {
            service: 'ProjectService',
            method: 'update',
            projectId: id,
            userId,
        });

        // Verify access
        await this.getById(id, userId);

        const project = await prisma.project.update({
            where: { id },
            data,
            include: {
                organization: {
                    select: { id: true, name: true }
                }
            }
        });

        return this.transformProject(project);
    }

    /**
     * Delete project
     */
    async delete(id: string, userId: string) {
        logger.info('Deleting project', {
            service: 'ProjectService',
            method: 'delete',
            projectId: id,
            userId,
        });

        // Verify access
        await this.getById(id, userId);

        await prisma.project.delete({
            where: { id }
        });

        return { success: true };
    }

    /**
     * Get project statistics
     */
    async getStats(userId: string) {
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = userOrgs.map(o => o.organizationId);

        const [total, active, completed, planning] = await Promise.all([
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds }
                }
            }),
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds },
                    status: ProjectStatus.ACTIVE
                }
            }),
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds },
                    status: ProjectStatus.COMPLETED
                }
            }),
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds },
                    status: ProjectStatus.PLANNING
                }
            }),
        ]);

        return { total, active, completed, planning };
    }

    /**
     * Transform project for client
     */
    private transformProject(project: any) {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            organizationId: project.organizationId,
            organization: project.organization,
            status: project.status,
            type: project.type,
            sector: project.sector,
            subsector: project.subsector,
            region: project.region,
            country: project.country,
            orgSize: project.orgSize,
            budgetRange: project.budgetRange,
            timeline: project.timeline,
            objectives: project.objectives,
            longDescription: project.longDescription,
            stakeholders: project.stakeholders,
            assessments: project.assessments?.map((a: any) => {
                const totalPartners = a.assessmentPartners?.length || 0;
                const completedPartners = a.assessmentPartners?.filter((p: any) => p.status === 'COMPLETED').length || 0;
                const completionPercentage = totalPartners > 0 ? Math.round((completedPartners / totalPartners) * 100) : 0;

                return {
                    ...a,
                    name: a.trustPartnerType?.name || a.type || 'Assessment',
                    partnerType: a.trustPartnerType?.name || a.partnerType, // Keep for backward compat if needed
                    domainScores: a.scores || [],
                    partnerCount: totalPartners,
                    completionPercentage
                };
            }),
            teamMembers: project.teamMembers,
            assessmentCount: project._count?.assessments,
            createdAt: project.createdAt?.toISOString(),
            updatedAt: project.updatedAt?.toISOString(),
        };
    }
}

// Export singleton instance
export const projectService = new ProjectService();
