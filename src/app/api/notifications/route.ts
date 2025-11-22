import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error('Notifications fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { notificationId, read } = body

        const notification = await prisma.notification.update({
            where: { id: notificationId, userId: session.user.id },
            data: { read }
        })

        return NextResponse.json(notification)
    } catch (error) {
        console.error('Notification update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
