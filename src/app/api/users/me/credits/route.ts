import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user's organization membership
        const orgMember = await prisma.organizationMember.findFirst({
            where: { userId: session.user.id },
            include: {
                organization: {
                    include: {
                        credits: {
                            include: {
                                transactions: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 10
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!orgMember || !orgMember.organization.credits.length) {
            return NextResponse.json({
                creditsTotal: 0,
                creditsUsed: 0,
                creditsRemaining: 0,
                transactions: []
            })
        }

        // Aggregate credits from all credit records
        const credits = orgMember.organization.credits
        const creditsTotal = credits.reduce((sum, c) => sum + (c.type === 'PURCHASE' ? c.amount : 0), 0)
        const creditsUsed = credits.reduce((sum, c) => sum + (c.type === 'USAGE' ? Math.abs(c.amount) : 0), 0)
        const creditsRemaining = creditsTotal - creditsUsed

        // Get all transactions
        const allTransactions = credits.flatMap(c => c.transactions).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10)

        return NextResponse.json({
            creditsTotal,
            creditsUsed,
            creditsRemaining,
            transactions: allTransactions
        })
    } catch (error) {
        console.error('Credits fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
