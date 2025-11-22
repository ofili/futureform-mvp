import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                project: {
                    select: { name: true }
                },
                partner: {
                    select: { firstName: true, lastName: true, email: true }
                },
                responses: {
                    include: {
                        question: true
                    }
                },
                scores: true,
                redFlags: true,
                trustProfile: true
            }
        })

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
        }

        // Check access
        const hasAccess = await prisma.projectTeamMember.findFirst({
            where: {
                projectId: assessment.projectId,
                userId: session.user.id,
                removedAt: null
            }
        })

        if (!hasAccess && assessment.partnerId !== session.user.id) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        return NextResponse.json(assessment)
    } catch (error) {
        console.error('Assessment fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { status } = body

        const assessment = await prisma.assessment.findUnique({
            where: { id }
        })

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
        }

        const updatedAssessment = await prisma.assessment.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(status === 'COMPLETED' && { completedAt: new Date() })
            }
        })

        return NextResponse.json(updatedAssessment)
    } catch (error) {
        console.error('Assessment update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
