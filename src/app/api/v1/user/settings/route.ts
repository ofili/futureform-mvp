import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                department: true,
                role: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Get user settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            firstName,
            lastName,
            jobTitle,
            department,
            currentPassword,
            newPassword
        } = body;

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password required' }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { id: session.user.id }
            });

            if (!user?.password) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            const updatedUser = await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    ...(firstName && { firstName }),
                    ...(lastName && { lastName }),
                    ...(jobTitle !== undefined && { jobTitle }),
                    ...(department && { department }),
                    password: hashedPassword
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    jobTitle: true,
                    department: true,
                    role: true
                }
            });

            return NextResponse.json(updatedUser);
        }

        // Update without password change
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(jobTitle !== undefined && { jobTitle }),
                ...(department && { department })
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                department: true,
                role: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Update user settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
