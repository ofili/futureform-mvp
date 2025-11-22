import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No token provided');

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  return decoded.userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);

    const [projectCount, assessmentCount, completedAssessments] = await Promise.all([
      prisma.project.count({
        where: { teamMembers: { some: { userId } } }
      }),
      prisma.assessment.count({
        where: { project: { teamMembers: { some: { userId } } } }
      }),
      prisma.assessment.count({
        where: {
          project: { teamMembers: { some: { userId } } },
          status: 'COMPLETED'
        }
      })
    ]);

    return NextResponse.json({
      projects: projectCount,
      assessments: assessmentCount,
      completed: completedAssessments,
      pending: assessmentCount - completedAssessments
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to get dashboard data' }, { status: 500 });
  }
}