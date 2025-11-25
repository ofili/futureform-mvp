import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

        // Calculate date range for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get stats for the month
        const [
            totalUsers,
            newUsers,
            totalOrganizations,
            newOrganizations,
            totalProjects,
            totalAssessments,
            completedAssessments,
            revenueByTier
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.organization.count(),
            prisma.organization.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.project.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.assessment.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.assessment.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: 'COMPLETED'
                }
            }),
            prisma.organization.groupBy({
                by: ['tierId'],
                _count: { _all: true },
                where: {
                    tierId: { not: null }
                }
            })
        ]);

        // Get tier details for revenue calculation
        const tiers = await prisma.subscriptionTier.findMany();
        const tierMap = new Map(tiers.map(t => [t.id, t]));

        const revenue = revenueByTier.reduce((sum, group) => {
            const tier = tierMap.get(group.tierId!);
            if (tier && tier.priceUSD) {
                return sum + (tier.priceUSD * group._count._all);
            }
            return sum;
        }, 0);

        // Get top organizations by assessment count
        const topOrganizations = await prisma.organization.findMany({
            take: 10,
            select: {
                id: true,
                name: true,
                _count: {
                    select: { projects: true, assessments: true }
                }
            },
            orderBy: {
                assessments: {
                    _count: 'desc'
                }
            }
        });

        const report = {
            period: {
                month,
                year,
                startDate,
                endDate
            },
            users: {
                total: totalUsers,
                new: newUsers,
                growth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : '0'
            },
            organizations: {
                total: totalOrganizations,
                new: newOrganizations,
                growth: totalOrganizations > 0 ? ((newOrganizations / totalOrganizations) * 100).toFixed(1) : '0'
            },
            projects: {
                total: totalProjects
            },
            assessments: {
                total: totalAssessments,
                completed: completedAssessments,
                completionRate: totalAssessments > 0 ? ((completedAssessments / totalAssessments) * 100).toFixed(1) : '0'
            },
            revenue: {
                monthly: revenue,
                byTier: revenueByTier.map(group => ({
                    tier: tierMap.get(group.tierId!)?.name || 'Unknown',
                    count: group._count._all,
                    revenue: (tierMap.get(group.tierId!)?.priceUSD || 0) * group._count._all
                }))
            },
            topOrganizations: topOrganizations.map(org => ({
                id: org.id,
                name: org.name,
                projects: org._count.projects,
                assessments: org._count.assessments
            }))
        };

        return NextResponse.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error generating monthly report:', error);
        return NextResponse.json(
            { error: 'Failed to generate report' },
            { status: 500 }
        );
    }
}
