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

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { firstName: true, lastName: true, email: true }
                },
                organization: {
                    select: { name: true }
                },
                assessments: {
                    include: {
                        scores: true
                    }
                },
                teamMembers: {
                    where: { removedAt: null },
                    include: {
                        user: {
                            select: { firstName: true, lastName: true, email: true }
                        }
                    }
                },
                _count: {
                    select: {
                        assessments: true,
                        comments: true,
                        documents: true
                    }
                }
            }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Check if user has access
        const hasAccess = project.createdById === session.user.id ||
            project.teamMembers.some(m => m.userId === session.user.id)

        if (!hasAccess) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error('Project fetch error:', error)
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
        const { name, description, status, sector, region, country } = body

        // Check if user has access
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                teamMembers: {
                    where: { userId: session.user.id, removedAt: null }
                }
            }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const hasAccess = project.createdById === session.user.id ||
            project.teamMembers.some(m => m.role === 'PROJECT_ADMIN')

        if (!hasAccess) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(status && { status }),
                ...(sector && { sector }),
                ...(region && { region }),
                ...(country && { country })
            }
        })

        return NextResponse.json(updatedProject)
    } catch (error) {
        console.error('Project update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const project = await prisma.project.findUnique({
            where: { id }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        if (project.createdById !== session.user.id) {
            return NextResponse.json({ error: 'Only project creator can delete' }, { status: 403 })
        }

        await prisma.project.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Project deleted' })
    } catch (error) {
        console.error('Project delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
