// Dashboard Service
// Handles dashboard statistics and analytics

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export interface DashboardStats {
    totalProjects: number;
    activeAssessments: number;
    completedAssessments: number;
    averageTrustScore: number;
}

export class DashboardService {
    /**
     * Get dashboard statistics for user's organizations
     */
    async getStats(userId: string): Promise<DashboardStats> {
        logger.info('Fetching dashboard stats', {
            service: 'DashboardService',
            method: 'getStats',
            userId,
        });

        // Get user's organizations
        const userOrgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = userOrgs.map(o => o.organizationId);

        // Calculate stats
        const [totalProjects, activeAssessments, completedAssessments, assessmentScores] = await Promise.all([
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds }
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: 'IN_PROGRESS'
                }
            }),
            prisma.assessment.count({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: 'COMPLETED'
                }
            }),
            // Get average score from Assessment.overallScore field
            prisma.assessment.aggregate({
                where: {
                    project: { organizationId: { in: orgIds } },
                    status: 'COMPLETED',
                    overallScore: { not: null }
                },
                _avg: { overallScore: true }
            })
        ]);

        return {
            totalProjects,
            activeAssessments,
            completedAssessments,
            averageTrustScore: assessmentScores._avg.overallScore || 0
        };
    }
}

// Export singleton instance
export const dashboardService = new DashboardService();
