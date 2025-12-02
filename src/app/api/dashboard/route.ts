import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'

    // Calculate date range
    const dateRange = getDateRange(timeframe)

    // Get user's projects and assessments
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: session.user.id },
          { teamMembers: { some: { userId: session.user.id, removedAt: null } } }
        ]
      },
      include: {
        assessments: {
          where: {
            createdAt: {
              gte: dateRange.start,
              lte: dateRange.end
            }
          },
          include: {
            scores: true,
            responses: true
          }
        }
      }
    })

    const allAssessments = projects.flatMap(p => p.assessments)
    const completedAssessments = allAssessments.filter(a => a.status === 'COMPLETED')

    // Calculate analytics
    const analyticsData = {
      overview: {
        totalAssessments: allAssessments.length,
        completedAssessments: completedAssessments.length,
        averageScore: completedAssessments.length > 0
          ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.overallScore || 0), 0) / completedAssessments.length)
          : 0,
        responseRate: allAssessments.length > 0
          ? Math.round((completedAssessments.length / allAssessments.length) * 100)
          : 0
      },
      domainScores: calculateDomainScores(completedAssessments),
      recentAssessments: completedAssessments.slice(0, 10).map(a => ({
        partnerName: a.partnerName,
        overallScore: a.overallScore || 0,
        completionDate: a.completedAt || a.createdAt
      }))
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDateRange(timeframe: string): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()

  switch (timeframe) {
    case '7d':
      start.setDate(end.getDate() - 7)
      break
    case '30d':
      start.setDate(end.getDate() - 30)
      break
    case '90d':
      start.setDate(end.getDate() - 90)
      break
    case '1y':
      start.setFullYear(end.getFullYear() - 1)
      break
    default:
      start.setDate(end.getDate() - 30)
  }

  return { start, end }
}

function calculateDomainScores(assessments: any[]) {
  const domains = ['Reliability', 'Transparency', 'Governance', 'Competence', 'Integrity']

  return domains.map(domain => {
    const domainScores = assessments.flatMap(a =>
      a.scores.filter((s: any) => s.domain === domain).map((s: any) => s.score)
    )

    const averageScore = domainScores.length > 0
      ? Math.round(domainScores.reduce((sum, score) => sum + score, 0) / domainScores.length)
      : 0

    return {
      domain,
      score: averageScore
    }
  })
}