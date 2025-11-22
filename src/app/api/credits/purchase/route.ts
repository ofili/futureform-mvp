import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { credits, currency = 'USD' } = await request.json()

        // Validate credit amount
        const validCreditPacks = [5, 15, 30, 50]
        if (!validCreditPacks.includes(credits)) {
            return NextResponse.json({ error: 'Invalid credit amount' }, { status: 400 })
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { email: true, firstName: true, lastName: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Calculate price
        const amount = calculatePrice(credits, currency)
        const transactionRef = `futureform-credits-${Date.now()}-${session.user.id}`

        // Get or create credit account
        const creditAccountId = await getOrCreateCreditAccount(session.user.id)

        // Store pending transaction
        await prisma.creditTransaction.create({
            data: {
                userId: session.user.id,
                creditId: creditAccountId,
                type: 'PURCHASE',
                creditsChange: credits,
                notes: `Pending purchase of ${credits} credits - Ref: ${transactionRef}`
            }
        })

        // TODO: Initialize payment gateway (Stripe/Flutterwave)
        // For now, return mock payment URL
        return NextResponse.json({
            success: true,
            paymentUrl: `/billing/checkout?ref=${transactionRef}`,
            transactionRef,
            amount,
            currency,
            message: 'Redirect to payment gateway'
        })

    } catch (error) {
        console.error('Credit purchase error:', error)
        return NextResponse.json({
            error: 'Failed to process payment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

async function getOrCreateCreditAccount(userId: string): Promise<string> {
    const orgMember = await prisma.organizationMember.findFirst({
        where: { userId },
        select: { organizationId: true }
    })

    if (!orgMember) {
        throw new Error('User not part of any organization')
    }

    let creditAccount = await prisma.credit.findFirst({
        where: { organizationId: orgMember.organizationId }
    })

    if (!creditAccount) {
        creditAccount = await prisma.credit.create({
            data: {
                organizationId: orgMember.organizationId,
                amount: 0,
                type: 'PURCHASE',
                description: 'Initial credit account'
            }
        })
    }

    return creditAccount.id
}

function calculatePrice(credits: number, currency: string): number {
    const pricing: Record<string, Record<number, number>> = {
        NGN: { 5: 45000, 15: 112500, 30: 202500, 50: 315000 },
        USD: { 5: 99, 15: 249, 30: 449, 50: 699 },
        KES: { 5: 12900, 15: 32400, 30: 58300, 50: 90800 },
        GHS: { 5: 1200, 15: 3000, 30: 5400, 50: 8400 },
    }

    const currencyPricing = pricing[currency] || pricing.USD
    return currencyPricing[credits] || credits * (currency === 'NGN' ? 9000 : 20)
}
