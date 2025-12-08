

import { NextResponse } from 'next/server'
import { userService } from '@/services/users/user.service'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        const result = await userService.initiatePasswordReset(email)

        if (result) {
            const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${result.token}`
            await sendPasswordResetEmail(result.userConfig.email, resetLink)
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link shortly.',
        })
    } catch (error) {
        console.error('Forgot Password Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

