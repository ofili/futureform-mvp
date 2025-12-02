import prisma from '@/lib/prisma'
import { sendNotification } from '@/lib/notifications'

export class CreditService {
    /**
     * Check if organization has sufficient credits for an assessment
     */
    static async hasSufficientCredits(organizationId: string): Promise<{
        hasCredits: boolean
        remaining: number
        message?: string
    }> {
        const creditBalance = await prisma.credit.findFirst({
            where: { organizationId }
        })

        if (!creditBalance || creditBalance.amount < 1) {
            return {
                hasCredits: false,
                remaining: 0,
                message: 'Insufficient credits to create assessment'
            }
        }

        return {
            hasCredits: true,
            remaining: creditBalance.amount
        }
    }

    /**
     * Deduct credit for assessment creation
     */
    static async useCreditForAssessment(organizationId: string, userId: string, assessmentId: string): Promise<void> {
        const creditBalance = await prisma.credit.findFirst({
            where: { organizationId }
        })

        if (!creditBalance || creditBalance.amount < 1) {
            throw new Error('Insufficient credits')
        }

        // Start transaction
        await prisma.$transaction(async (tx) => {
            // Update credit balance
            await tx.credit.update({
                where: { id: creditBalance.id },
                data: {
                    amount: { decrement: 1 }
                }
            })

            // Create transaction record
            await tx.creditTransaction.create({
                data: {
                    creditId: creditBalance.id,
                    userId,
                    type: 'USAGE',
                    creditsChange: -1,
                    assessmentId,
                    notes: 'Assessment creation'
                }
            })
        })

        // Check if credits are low
        if (creditBalance.amount - 1 <= 2) {
            // Notify organization admins? For now notify the user who triggered it if they are admin, or just generic notification logic
            // We might need to find org admins to notify.
            // For now, let's skip notification or send to the user if we want.
            // The original code sent to userId.
            await this.sendLowCreditNotification(userId, creditBalance.amount - 1)
        }
    }

    /**
     * Refund credit for cancelled assessment
     */
    static async refundCredit(assessmentId: string): Promise<void> {
        const transaction = await prisma.creditTransaction.findFirst({
            where: {
                assessmentId,
                type: 'USAGE'
            },
            include: {
                credit: true
            }
        })

        if (!transaction) {
            throw new Error('No credit transaction found for assessment')
        }

        await prisma.$transaction(async (tx) => {
            await tx.credit.update({
                where: { id: transaction.creditId },
                data: {
                    amount: { increment: 1 }
                }
            })

            await tx.creditTransaction.create({
                data: {
                    creditId: transaction.creditId,
                    userId: transaction.userId,
                    type: 'REFUND',
                    creditsChange: 1,
                    assessmentId,
                    notes: 'Assessment cancelled - credit refund'
                }
            })
        })
    }

    /**
     * Add credits from purchase
     */
    static async addCreditsFromPurchase(organizationId: string, userId: string, credits: number, paymentIntentId: string): Promise<void> {
        const creditBalance = await prisma.credit.findFirst({
            where: { organizationId }
        })

        if (!creditBalance) {
            // Create credit account if it doesn't exist?
            // Or throw error. Usually org creation creates credit account.
            // Let's assume it exists or create it.
            await prisma.credit.create({
                data: {
                    organizationId,
                    amount: credits,
                    type: 'PURCHASE',
                    description: 'Initial purchase'
                }
            })
            return;
        }

        await prisma.$transaction(async (tx) => {
            await tx.credit.update({
                where: { id: creditBalance.id },
                data: {
                    amount: { increment: credits }
                }
            })

            await tx.creditTransaction.create({
                data: {
                    creditId: creditBalance.id,
                    userId,
                    type: 'PURCHASE',
                    creditsChange: credits,
                    notes: `Purchased ${credits} credits - Payment: ${paymentIntentId}`
                }
            })
        })
    }

    /**
     * Send low credit notification
     */
    private static async sendLowCreditNotification(userId: string, remainingCredits: number) {
        try {
            await sendNotification(userId, 'credit_low', {
                remainingCredits,
                message: `You have ${remainingCredits} credit(s) remaining. Consider purchasing more.`
            })
        } catch (error) {
            console.error('Error sending low credit notification:', error)
        }
    }
}

/**
 * Get organization credit balance
 */
export async function getOrganizationCreditBalance(organizationId: string) {
    const creditBalance = await prisma.credit.findFirst({
        where: { organizationId },
        include: {
            transactions: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            }
        }
    })

    if (!creditBalance) {
        return {
            amount: 0,
            transactions: []
        }
    }

    return creditBalance
}

/**
 * Check if assessment can be created
 */
export async function canCreateAssessment(userId: string, projectId: string): Promise<{
    canCreate: boolean
    reason?: string
    creditsRemaining?: number
}> {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { organizationId: true }
        });

        if (!project || !project.organizationId) {
            return {
                canCreate: false,
                reason: 'Project not associated with an organization'
            }
        }

        const creditCheck = await CreditService.hasSufficientCredits(project.organizationId)
        if (!creditCheck.hasCredits) {
            return {
                canCreate: false,
                reason: 'Insufficient credits',
                creditsRemaining: creditCheck.remaining
            }
        }

        const projectMember = await prisma.projectTeamMember.findFirst({
            where: {
                projectId,
                userId,
                removedAt: null
            }
        })

        if (!projectMember) {
            return {
                canCreate: false,
                reason: 'No access to project'
            }
        }

        return {
            canCreate: true,
            creditsRemaining: creditCheck.remaining
        }
    } catch (error) {
        console.error('Error checking assessment creation eligibility:', error)
        return {
            canCreate: false,
            reason: 'Error checking eligibility'
        }
    }
}
