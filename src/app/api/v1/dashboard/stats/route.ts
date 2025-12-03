import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organizations
    const userOrgs = await prisma.organizationMember.findMany({
      where: { userId: session.user.id, deletedAt: null },
      select: { organizationId: true }
    });

    const orgIds = userOrgs.map(o => o.organizationId);

    // Calculate stats
    const [totalProjects, activeAssessments, completedAssessments, assessmentScores] = await Promise.all([
      prisma.project.count({
        where: {
          organizationId: { in: orgIds },
          deletedAt: null
        }
      }),
      prisma.assessment.count({
        where: {
          project: { organizationId: { in: orgIds } },
          status: 'IN_PROGRESS',
          deletedAt: null
        }
      }),
      prisma.assessment.count({
        where: {
          project: { organizationId: { in: orgIds } },
          status: 'COMPLETED',
          deletedAt: null
        }
      }),
      // Get average score from AssessmentScore table
      prisma.assessmentScore.aggregate({
        where: {
          assessment: {
            project: { organizationId: { in: orgIds } },
            status: 'COMPLETED'
          }
        },
        _avg: { score: true }
      })
    ]);

    const stats = {
      totalProjects,
      activeAssessments,
      completedAssessments,
      averageTrustScore: assessmentScores._avg.score || 0
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}