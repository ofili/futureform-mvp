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
     * Get monthly report
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

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const [
            newUsers,
            newOrganizations,
            newProjects,
            newAssessments,
        ] = await Promise.all([
            prisma.user.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.organization.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.project.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.assessment.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
        ]);

        return {
            period: { month, year, startDate, endDate },
            newUsers,
            newOrganizations,
            newProjects,
            newAssessments,
        };
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
