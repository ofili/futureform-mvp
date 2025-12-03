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
    sector?: string;
    region?: string;
    country?: string;
    budget?: number;
    startDate?: Date;
    endDate?: Date;
    riskLevel?: string;
    metadata?: any;
}

// ... existing code ...

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
            region: data.region,
            country: data.country,
            budget: data.budget,
            startDate: data.startDate,
            endDate: data.endDate,
            riskLevel: data.riskLevel,
            metadata: data.metadata,
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
     * Delete project (soft delete)
     */
    async delete (id: string, userId: string) {
    logger.info('Deleting project', {
        service: 'ProjectService',
        method: 'delete',
        projectId: id,
        userId,
    });

    // Verify access
    await this.getById(id, userId);

    await prisma.project.update({
        where: { id },
        data: { deletedAt: new Date() }
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
                organizationId: { in: orgIds },
                deletedAt: null
            }
        }),
        prisma.project.count({
            where: {
                organizationId: { in: orgIds },
                status: ProjectStatus.ACTIVE,
                deletedAt: null
            }
        }),
        prisma.project.count({
            where: {
                organizationId: { in: orgIds },
                status: ProjectStatus.COMPLETED,
                deletedAt: null
            }
        }),
        prisma.project.count({
            where: {
                organizationId: { in: orgIds },
                status: ProjectStatus.PLANNING,
                deletedAt: null
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
        sector: project.sector,
        region: project.region,
        country: project.country,
        budget: project.budget,
        startDate: project.startDate?.toISOString(),
        endDate: project.endDate?.toISOString(),
        riskLevel: project.riskLevel,
        metadata: project.metadata,
        assessments: project.assessments,
        teamMembers: project.teamMembers,
        assessmentCount: project._count?.assessments,
        createdAt: project.createdAt?.toISOString(),
        updatedAt: project.updatedAt?.toISOString(),
        deletedAt: project.deletedAt?.toISOString(),
    };
}
}

// Export singleton instance
export const projectService = new ProjectService();
