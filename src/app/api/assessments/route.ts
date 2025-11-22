import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, partnerName, partnerType, partnerEmail } = body

    // Verify user has access to the project
    const projectMember = await prisma.projectTeamMember.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        removedAt: null
      }
    })

    if (!projectMember) {
      return NextResponse.json({ error: 'Access denied to project' }, { status: 403 })
    }

    // Generate unique token for assessment
    const token = crypto.randomUUID()

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        projectId,
        partnerName,
        partnerType,
        token,
        status: 'PENDING',
        partnerId: session.user.id // Temporary - will be updated when partner accepts
      },
      include: {
        project: {
          select: { name: true }
        }
      }
    })

    // TODO: Send invitation email
    // await sendAssessmentInvitation({ to: partnerEmail, ... })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Assessment creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        project: {
          OR: [
            { createdById: session.user.id },
            { teamMembers: { some: { userId: session.user.id, removedAt: null } } }
          ]
        }
      },
      include: {
        project: {
          select: { name: true }
        },
        partner: {
          select: { firstName: true, lastName: true, email: true }
        },
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Assessments fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}