// User Service
// Handles user profile and preferences

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    title?: string;
    department?: string;
    bio?: string;
}

export class UserService {
    /**
     * Get user profile
     */
    async getProfile(userId: string) {
        logger.info('Fetching user profile', {
            service: 'UserService',
            method: 'getProfile',
            userId,
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                department: true,
                // bio: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileInput) {
        logger.info('Updating user profile', {
            service: 'UserService',
            method: 'updateProfile',
            userId,
        });

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                department: true,
                // bio: true,
                role: true,
                updatedAt: true,
            }
        });

        return user;
    }

    /**
     * Get user's organizations
     */
    async getOrganizations(userId: string) {
        const memberships = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                }
            }
        });

        return memberships.map(m => ({
            ...m.organization,
            role: m.role
            // joinedAt: m.createdAt.toISOString()
        }));
    }

    /**
     * Get user's projects
     */
    async getProjects(userId: string) {
        const orgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = orgs.map(o => o.organizationId);

        const projects = await prisma.project.findMany({
            where: {
                organizationId: { in: orgIds }
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                createdAt: true,
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return projects;
    }

    /**
     * Get user dashboard stats
     */
    async getDashboardStats(userId: string) {
        const orgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = orgs.map(o => o.organizationId);

        const [projectCount, assessmentCount, organizationCount] = await Promise.all([
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds }
                }
            }),
            prisma.assessment.count({
                where: {
                    project: {
                        organizationId: { in: orgIds }
                    }
                }
            }),
            orgs.length
        ]);

        return {
            projectCount,
            assessmentCount,
            organizationCount
        };
    }
}

// Export singleton instance
export const userService = new UserService();
