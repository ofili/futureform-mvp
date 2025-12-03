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
}

// Export singleton instance
export const adminService = new AdminService();
