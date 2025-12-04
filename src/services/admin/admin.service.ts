// Admin Service
// Handles administrative operations

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { UserRole } from '@prisma/client';

export class AdminService {
    /**
     * Verify admin access
     */
    private async verifyAdmin(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== UserRole.ADMIN) {
            throw new Error('Admin access required');
        }

        return true;
    }

    /**
     * Get system statistics
     */
    async getSystemStats(userId: string) {
        await this.verifyAdmin(userId);

        logger.info('Fetching system stats', {
            service: 'AdminService',
            method: 'getSystemStats',
            userId,
        });

        const [
            totalUsers,
            totalOrganizations,
            totalProjects,
            totalAssessments,
            activeUsers,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.organization.count(),
            prisma.project.count({ where: { deletedAt: null } }),
            prisma.assessment.count({ where: { deletedAt: null } }),
            prisma.user.count({
                where: {
                    lastLoginAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                }
            }),
        ]);

        return {
            totalUsers,
            totalOrganizations,
            totalProjects,
            totalAssessments,
            activeUsers,
        };
    }

    /**
 * Get comprehensive monthly report
 */
    async getMonthlyReport(userId: string, month: number, year: number) {
        await this.verifyAdmin(userId);

        logger.info('Generating monthly report', {
            service: 'AdminService',
            method: 'getMonthlyReport',
            userId,
            month,
            year,
        });

        // Validate input
        if (month < 1 || month > 12) {
            throw new Error('Invalid month. Must be between 1 and 12.');
        }
        if (year < 2000 || year > 2100) {
            throw new Error('Invalid year.');
        }

        // Use consistent date logic (match your DB timezone)
        // If your DB uses UTC, prefer Date.UTC — but many apps use local dates for reporting
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Fetch all data in parallel
        const [
            totalUsers,
            newUsers,
            totalOrganizations,
            newOrganizations,
            totalProjects,
            totalAssessments,
            completedAssessments,
            revenueByTier,
            tiers,
            topOrganizations,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
            prisma.organization.count(),
            prisma.organization.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
            prisma.project.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
            prisma.assessment.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
            prisma.assessment.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: 'COMPLETED',
                },
            }),
            prisma.organization.groupBy({
                by: ['tierId'],
                _count: { _all: true },
                where: { tierId: { not: null } },
            }),
            prisma.subscriptionTier.findMany(),
            prisma.organization.findMany({
                take: 10,
                select: {
                    id: true,
                    name: true,
                    _count: { select: { projects: true } },
                },
                orderBy: { projects: { _count: 'desc' } },
            }),
        ]);

        // Helper to safely convert Decimal to number
        const decimalToNumber = (value: unknown): number => {
            if (value == null) return 0;
            if (typeof value === 'number') return value;
            if (typeof value === 'object' && value !== null && 'toNumber' in value) {
                return (value as any).toNumber();
            }
            return Number(value);
        };

        const tierMap = new Map(tiers.map((t) => [t.id, t]));

        const monthlyRevenue = revenueByTier.reduce((sum, group) => {
            const tier = tierMap.get(group.tierId!);
            if (tier?.priceUSD != null) {
                const price = decimalToNumber(tier.priceUSD);
                return sum + price * group._count._all;
            }
            return sum;
        }, 0);

        const revenueByTierFormatted = revenueByTier.map((group) => {
            const tier = tierMap.get(group.tierId!);
            const price = tier?.priceUSD ? decimalToNumber(tier.priceUSD) : 0;
            return {
                tier: tier?.name || 'Unknown',
                count: group._count._all,
                revenue: price * group._count._all,
            };
        });

        const report = {
            period: {
                month,
                year,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
            users: {
                total: totalUsers,
                new: newUsers,
                growth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : '0.0',
            },
            organizations: {
                total: totalOrganizations,
                new: newOrganizations,
                growth:
                    totalOrganizations > 0
                        ? ((newOrganizations / totalOrganizations) * 100).toFixed(1)
                        : '0.0',
            },
            projects: {
                total: totalProjects,
            },
            assessments: {
                total: totalAssessments,
                completed: completedAssessments,
                completionRate:
                    totalAssessments > 0
                        ? ((completedAssessments / totalAssessments) * 100).toFixed(1)
                        : '0.0',
            },
            revenue: {
                monthly: monthlyRevenue,
                byTier: revenueByTierFormatted,
            },
            topOrganizations: topOrganizations.map((org) => ({
                id: org.id,
                name: org.name,
                projects: org._count.projects,
            })),
        };

        return report;
    }

    /**
     * List all users (admin only)
     */
    async listUsers(userId: string, limit = 50, offset = 0) {
        await this.verifyAdmin(userId);

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                lastLoginAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        return users;
    }

    /**
     * Update user role (admin only)
     */
    async updateUserRole(adminId: string, userId: string, newRole: UserRole) {
        await this.verifyAdmin(adminId);

        logger.info('Updating user role', {
            service: 'AdminService',
            method: 'updateUserRole',
            adminId,
            userId,
            newRole,
        });

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            }
        });

        return user;
    }

    /**
     * Get system logs (admin only)
     */
    async getLogs(userId: string, limit = 100, offset = 0) {
        await this.verifyAdmin(userId);

        // TODO: Implement proper logging system
        // For now, return placeholder
        return {
            logs: [],
            total: 0,
        };
    }

    /**
     * List users with filters (for admin UI)
     */
    async listUsersWithFilters(userId: string, search?: string, role?: string) {
        await this.verifyAdmin(userId);

        logger.info('Listing users with filters', {
            service: 'AdminService',
            method: 'listUsersWithFilters',
            userId,
            search,
            role,
        });

        const where: any = {};

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (role && role !== 'all') {
            where.role = role.toUpperCase();
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                organizations: {
                    where: { deletedAt: null },
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    take: 1
                },
                assessments: {
                    select: { id: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role.toLowerCase(),
            organizationName: user.organizations[0]?.organization.name || 'No Organization',
            status: 'active',
            lastLogin: user.updatedAt.toISOString(),
            createdAt: user.createdAt.toISOString(),
            assessmentCount: user.assessments.length
        }));
    }

    /**
     * List all organizations (admin only)
     */
    async listOrganizations(userId: string, search?: string, tier?: string) {
        await this.verifyAdmin(userId);

        logger.info('Listing organizations', {
            service: 'AdminService',
            method: 'listOrganizations',
            userId,
            search,
            tier,
        });

        const where: any = {};

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        if (tier && tier !== 'all') {
            where.tierId = tier;
        }

        const organizations = await prisma.organization.findMany({
            where,
            include: {
                tier: {
                    select: {
                        id: true,
                        displayName: true,
                        priceUSD: true
                    }
                },
                _count: {
                    select: {
                        members: true,
                        projects: true,
                        assessments: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return organizations.map(org => ({
            id: org.id,
            name: org.name,
            tier: org.tier?.displayName || 'Free',
            memberCount: org._count.members,
            projectCount: org._count.projects,
            assessmentCount: org._count.assessments,
            monthlyRevenue: org.tier?.priceUSD ? Number(org.tier.priceUSD) : 0,
            createdAt: org.createdAt.toISOString()
        }));
    }

    /**
     * Get organization by ID (admin only)
     */
    async getOrganizationById(userId: string, organizationId: string) {
        await this.verifyAdmin(userId);

        logger.info('Fetching organization by ID', {
            service: 'AdminService',
            method: 'getOrganizationById',
            userId,
            organizationId,
        });

        const organization = await prisma.organization.findUnique({
            where: { id: organizationId },
            include: {
                tier: true,
                members: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                },
                assessments: {
                    select: {
                        id: true,
                        status: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        return organization;
    }

    /**
     * List all organizations with detailed info (admin only)
     */
    async listOrganizationsDetailed(userId: string, search?: string, tier?: string, stage?: string) {
        await this.verifyAdmin(userId);

        logger.info('Listing organizations with details', {
            service: 'AdminService',
            method: 'listOrganizationsDetailed',
            userId,
            search,
            tier,
            stage,
        });

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (tier) {
            where.tierId = tier;
        }

        if (stage) {
            where.relationshipStage = stage;
        }

        const organizations = await prisma.organization.findMany({
            where,
            include: {
                tier: true,
                members: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                },
                credits: {
                    select: {
                        id: true,
                        amount: true
                    },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return organizations;
    }

    /**
     * Update organization (admin only)
     */
    async updateOrganization(userId: string, organizationId: string, data: any) {
        await this.verifyAdmin(userId);

        logger.info('Updating organization', {
            service: 'AdminService',
            method: 'updateOrganization',
            userId,
            organizationId,
        });

        const organization = await prisma.organization.update({
            where: { id: organizationId },
            data,
            include: {
                tier: true,
                members: {
                    where: { deletedAt: null }
                }
            }
        });

        return organization;
    }

    /**
     * Update user role with validation (admin only)
     */
    async updateUserRoleValidated(userId: string, targetUserId: string, newRole: string) {
        await this.verifyAdmin(userId);

        logger.info('Updating user role with validation', {
            service: 'AdminService',
            method: 'updateUserRoleValidated',
            userId,
            targetUserId,
            newRole,
        });

        // Validate role
        const validRoles = ['ADMIN', 'USER'];
        if (!validRoles.includes(newRole.toUpperCase())) {
            throw new Error('Invalid role');
        }

        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: { role: newRole.toUpperCase() as any },
            include: {
                organizations: {
                    where: { deletedAt: null },
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return updatedUser;
    }

    /**
     * Verify admin access (public version for routes)
     */
    verifyAdminRole(userRole: string): boolean {
        return userRole === 'ADMIN';
    }
}

// Export singleton instance
export const adminService = new AdminService();
