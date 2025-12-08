
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { userService } from '@/services/users/user.service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, organization, user, plan } = body;

        if (!email || !organization || !user) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Determine tier based on plan
        const tierName = plan === 'guided' ? 'Guided' : 'Free';

        // Get the tier
        const selectedTier = await prisma.subscriptionTier.findFirst({
            where: { name: tierName }
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 12);

        try {
            const result = await userService.register({
                email,
                passwordHash: hashedPassword,
                user,
                organization,
                plan,
                tierId: selectedTier?.id
            });

            return NextResponse.json({
                message: 'Registration successful. Please log in.',
                userId: result.user.id
            });
        } catch (error: any) {
             if (error.message === 'User already exists') {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
             }
             throw error;
        }

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

