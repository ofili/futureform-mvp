import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      totalOrganizations,
      totalProjects,
      totalAssessments,
      activeSubscriptionsCount,
      openTickets,
      organizationsWithTiers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.project.count(),
      prisma.assessment.count(),
      prisma.organization.count({
        where: { tierId: { not: null } }
      }),
      prisma.supportTicket.count({
        where: { status: 'OPEN' }
      }),
      prisma.organization.findMany({
        where: { tierId: { not: null } },
        select: {
          tier: {
            select: {
              priceUSD: true
            }
          }
        }
      })
    ]);

    // Calculate MRR
    const monthlyRevenue = organizationsWithTiers.reduce((acc, org) => {
      const price = org.tier?.priceUSD ? Number(org.tier.priceUSD) : 0;
      return acc + price;
    }, 0);

    const stats = {
      totalUsers,
      totalOrganizations,
      totalProjects,
      totalAssessments,
      monthlyRevenue,
      activeSubscriptions: activeSubscriptionsCount,
      pendingIssues: openTickets,
      systemHealth: 100 // Placeholder
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}