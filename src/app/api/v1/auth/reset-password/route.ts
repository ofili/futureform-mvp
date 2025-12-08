

import { NextResponse } from 'next/server'
import { userService } from '@/services/users/user.service'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            )
        }

        // Hash password before sending to service (or let service handle it - but standardizing here)
        // Service expects hashed password as per my previous tool call signature
        const hashedPassword = await hash(password, 12)

        try {
            await userService.completePasswordReset(token, hashedPassword)
            return NextResponse.json({
                success: true,
                message: 'Password successfully reset',
            })
        } catch (error: any) {
            return NextResponse.json(
                { error: error.message || 'Invalid request' },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error('Reset Password Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

