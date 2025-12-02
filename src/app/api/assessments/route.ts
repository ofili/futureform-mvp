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
    const { projectId, partnerName, partnerType, partnerEmail, partnerAliasId, partnerGlobalId } = body

    // Verify user has access to the project
    const projectMember = await prisma.projectTeamMember.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        removedAt: null
      },
      include: {
        project: {
          select: { organizationId: true }
        }
      }
    })

    if (!projectMember) {
      return NextResponse.json({ error: 'Access denied to project' }, { status: 403 })
    }

    const organizationId = projectMember.project.organizationId

    if (!organizationId) {
      return NextResponse.json({ error: 'Project must belong to an organization' }, { status: 400 })
    }

    // Resolve Partner IDs
    let finalPartnerGlobalId = partnerGlobalId
    let finalPartnerAliasId = partnerAliasId

    // If we have a name but no IDs, try to find/create partner logic
    if (!finalPartnerAliasId && partnerName) {
      // 1. Check if alias exists
      const existingAlias = await prisma.partnerAlias.findFirst({
        where: {
          organizationId,
          displayName: { equals: partnerName, mode: 'insensitive' }
        }
      })

      if (existingAlias) {
        finalPartnerAliasId = existingAlias.id
        finalPartnerGlobalId = existingAlias.partnerId
      } else {
        // 2. Check global partner (if global ID provided or by name)
        let globalPartnerId = partnerGlobalId

        if (!globalPartnerId) {
          const existingGlobal = await prisma.partner.findFirst({
            where: { legalName: { equals: partnerName, mode: 'insensitive' } }
          })

          if (existingGlobal) {
            globalPartnerId = existingGlobal.id
          } else {
            // Create new global partner
            const newGlobal = await prisma.partner.create({
              data: {
                legalName: partnerName,
                sector: partnerType,
                createdByOrgId: organizationId,
                verification: 'UNVERIFIED'
              }
            })
            globalPartnerId = newGlobal.id
          }
        }

        // 3. Create Alias
        const newAlias = await prisma.partnerAlias.create({
          data: {
            partnerId: globalPartnerId,
            organizationId,
            displayName: partnerName,
            cachedSector: partnerType,
            relationshipStatus: 'Active'
          }
        })

        finalPartnerAliasId = newAlias.id
        finalPartnerGlobalId = globalPartnerId
      }
    }

    // Generate unique token for assessment
    const token = crypto.randomUUID()

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        projectId,
        partnerName, // Keep for backward compat
        partnerType, // Keep for backward compat
        partnerGlobalId: finalPartnerGlobalId,
        partnerAliasId: finalPartnerAliasId,
        token,
        status: 'PENDING',
        partnerId: session.user.id // Temporary - will be updated when partner accepts
      },
      include: {
        project: {
          select: { name: true }
        },
        partnerAlias: true
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
        partnerAlias: {
          select: { displayName: true, cachedSector: true, cachedCountry: true }
        },
        partnerGlobal: {
          select: { legalName: true, website: true, verification: true }
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