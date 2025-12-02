import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user's organization
        const userOrg = await prisma.organizationMember.findFirst({
            where: { userId: session.user.id },
            include: { organization: true }
        })

        if (!userOrg) {
            return NextResponse.json({ error: 'User not part of any organization' }, { status: 400 })
        }

        // Get organization invitations
        const invitations = await prisma.organizationInvitation.findMany({
            where: { organizationId: userOrg.organization.id },
            include: {
                invitedByUser: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { invitedAt: 'desc' }
        })

        // Format response
        const formattedInvitations = invitations.map(invitation => ({
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            invitedBy: `${invitation.invitedByUser.firstName} ${invitation.invitedByUser.lastName}`,
            invitedAt: invitation.invitedAt,
            status: invitation.status
        }))

        return NextResponse.json(formattedInvitations)
    } catch (error) {
        console.error('Organization invitations fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { email, role } = body

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
        }

        // Get user's organization
        const userOrg = await prisma.organizationMember.findFirst({
            where: { userId: session.user.id },
            include: { organization: true }
        })

        if (!userOrg) {
            return NextResponse.json({ error: 'User not part of any organization' }, { status: 400 })
        }

        // Check if user is admin
        if (userOrg.role !== 'ADMIN' && userOrg.role !== 'OWNER') {
            return NextResponse.json({ error: 'Only admins can invite members' }, { status: 403 })
        }

        // Check if user already exists in organization
        const existingMember = await prisma.organizationMember.findFirst({
            where: {
                organizationId: userOrg.organization.id,
                user: { email }
            }
        })

        if (existingMember) {
            return NextResponse.json({ error: 'User already a member' }, { status: 400 })
        }

        // Create invitation
        const invitation = await prisma.organizationInvitation.create({
            data: {
                organizationId: userOrg.organization.id,
                email,
                role,
                invitedBy: session.user.id,
                token: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        })

        // TODO: Send invitation email

        return NextResponse.json(invitation, { status: 201 })
    } catch (error) {
        console.error('Organization invitation creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
