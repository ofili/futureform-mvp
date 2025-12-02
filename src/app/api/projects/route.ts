import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, type, sector, region, country, maturityLevel, budgetRange, timeline, objectives, stakeholders } = body

    // Get user's organization
    const userOrg = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id },
      include: { organization: true }
    })

    if (!userOrg) {
      return NextResponse.json({ error: 'User not part of any organization' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        type,
        sector,
        region,
        country,
        maturityLevel,
        budgetRange,
        timeline,
        objectives,
        stakeholders,
        createdById: session.user.id,
        organizationId: userOrg.organizationId,
        status: 'PLANNING'
      },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    // Add creator as project admin team member
    await prisma.projectTeamMember.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        invitedBy: session.user.id,
        role: 'PROJECT_ADMIN',
        invitationToken: crypto.randomUUID(),
        invitationStatus: 'ACCEPTED',
        invitationAcceptedAt: new Date()
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: session.user.id },
          { teamMembers: { some: { userId: session.user.id, removedAt: null } } }
        ],
        ...(organizationId && { organizationId })
      },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true }
        },
        _count: {
          select: {
            assessments: true,
            teamMembers: {
              where: { removedAt: null }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}