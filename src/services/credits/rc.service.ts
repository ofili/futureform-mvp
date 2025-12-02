// Respondent Credits Service
// Handles all business logic for RC (Respondent Credits) management

import prisma from '@/lib/prisma';
import { InsufficientCreditsError, CreditExpiredError, InvalidPackageError } from '@/lib/errors/credit-errors';
import { logger } from '@/lib/logger';
import { RCTxType, Prisma } from '@prisma/client';

export interface RCBalance {
    totalPurchased: number;
    totalUsed: number;
    totalAvailable: number;
    expiresAt: Date | null;
}

export interface RCTransaction {
    id: string;
    type: RCTxType;
    amount: number;
    balance: number;
    assessmentId?: string;
    respondentId?: string;
    notes?: string;
    createdAt: Date;
}

export interface RCUsageReport {
    period: {
        start: Date;
        end: Date;
    };
    totalUsed: number;
    totalPurchased: number;
    transactions: RCTransaction[];
    usageByAssessment: {
        assessmentId: string;
        respondentCount: number;
    }[];
}

export class RCService {
    /**
     * Get RC balance for an organization
     */
    async getBalance(organizationId: string): Promise<RCBalance> {
        logger.debug('Getting RC balance', {
            service: 'RCService',
            method: 'getBalance',
            organizationId,
        });

        let rcRecord = await prisma.respondentCredit.findUnique({
            where: { organizationId },
        });

        // Create RC record if it doesn't exist
        if (!rcRecord) {
            rcRecord = await prisma.respondentCredit.create({
                data: {
                    organizationId,
                    totalPurchased: 0,
                    totalUsed: 0,
                    totalAvailable: 0,
                },
            });
        }

        return {
            totalPurchased: rcRecord.totalPurchased,
            totalUsed: rcRecord.totalUsed,
            totalAvailable: rcRecord.totalAvailable,
            expiresAt: rcRecord.expiresAt,
        };
    }

    /**
     * Purchase RC credits
     */
    async purchaseRC(
        organizationId: string,
        amount: number,
        packageId?: string,
        notes?: string
    ): Promise<RCTransaction> {
        logger.info('Purchasing RC credits', {
            service: 'RCService',
            method: 'purchaseRC',
            organizationId,
            amount,
            packageId,
        });

        if (amount <= 0) {
            throw new Error('Purchase amount must be positive');
        }

        return await prisma.$transaction(async (tx) => {
            // Get or create RC record
            let rcRecord = await tx.respondentCredit.findUnique({
                where: { organizationId },
            });

            if (!rcRecord) {
                rcRecord = await tx.respondentCredit.create({
                    data: {
                        organizationId,
                        totalPurchased: 0,
                        totalUsed: 0,
                        totalAvailable: 0,
                    },
                });
            }

            // Update balances
            const newBalance = rcRecord.totalAvailable + amount;
            await tx.respondentCredit.update({
                where: { organizationId },
                data: {
                    totalPurchased: { increment: amount },
                    totalAvailable: newBalance,
                },
            });

            // Create transaction record
            const transaction = await tx.respondentCreditTx.create({
                data: {
                    creditId: rcRecord.id,
                    type: RCTxType.PURCHASE,
                    amount,
                    balance: newBalance,
                    packageId,
                    notes,
                },
            });

            logger.info('RC credits purchased successfully', {
                service: 'RCService',
                method: 'purchaseRC',
                organizationId,
                amount,
                newBalance,
            });

            return {
                id: transaction.id,
                type: transaction.type,
                amount: transaction.amount,
                balance: transaction.balance,
                notes: transaction.notes || undefined,
                createdAt: transaction.createdAt,
            };
        });
    }

    /**
     * Consume RC credits (when a respondent is added to an assessment)
     */
    async consumeRC(
        organizationId: string,
        assessmentId: string,
        respondentId: string,
        notes?: string
    ): Promise<RCTransaction> {
        logger.info('Consuming RC credit', {
            service: 'RCService',
            method: 'consumeRC',
            organizationId,
            assessmentId,
            respondentId,
        });

        return await prisma.$transaction(async (tx) => {
            const rcRecord = await tx.respondentCredit.findUnique({
                where: { organizationId },
            });

            if (!rcRecord) {
                throw new InsufficientCreditsError('RC', 1, 0);
            }

            // Check if credits have expired
            if (rcRecord.expiresAt && rcRecord.expiresAt < new Date()) {
                throw new CreditExpiredError('RC');
            }

            // Check if sufficient credits available
            if (rcRecord.totalAvailable < 1) {
                throw new InsufficientCreditsError('RC', 1, rcRecord.totalAvailable);
            }

            // Update balances
            const newBalance = rcRecord.totalAvailable - 1;
            await tx.respondentCredit.update({
                where: { organizationId },
                data: {
                    totalUsed: { increment: 1 },
                    totalAvailable: newBalance,
                },
            });

            // Create transaction record
            const transaction = await tx.respondentCreditTx.create({
                data: {
                    creditId: rcRecord.id,
                    type: RCTxType.USAGE,
                    amount: -1,
                    balance: newBalance,
                    assessmentId,
                    respondentId,
                    notes,
                },
            });

            logger.info('RC credit consumed successfully', {
                service: 'RCService',
                method: 'consumeRC',
                organizationId,
                assessmentId,
                respondentId,
                newBalance,
            });

            return {
                id: transaction.id,
                type: transaction.type,
                amount: transaction.amount,
                balance: transaction.balance,
                assessmentId: transaction.assessmentId || undefined,
                respondentId: transaction.respondentId || undefined,
                notes: transaction.notes || undefined,
                createdAt: transaction.createdAt,
            };
        });
    }

    /**
     * Refund RC credits
     */
    async refundRC(
        organizationId: string,
        amount: number,
        reason: string
    ): Promise<RCTransaction> {
        logger.info('Refunding RC credits', {
            service: 'RCService',
            method: 'refundRC',
            organizationId,
            amount,
            reason,
        });

        if (amount <= 0) {
            throw new Error('Refund amount must be positive');
        }

        return await prisma.$transaction(async (tx) => {
            const rcRecord = await tx.respondentCredit.findUnique({
                where: { organizationId },
            });

            if (!rcRecord) {
                throw new Error('No RC record found for organization');
            }

            // Update balances
            const newBalance = rcRecord.totalAvailable + amount;
            await tx.respondentCredit.update({
                where: { organizationId },
                data: {
                    totalUsed: { decrement: amount },
                    totalAvailable: newBalance,
                },
            });

            // Create transaction record
            const transaction = await tx.respondentCreditTx.create({
                data: {
                    creditId: rcRecord.id,
                    type: RCTxType.REFUND,
                    amount,
                    balance: newBalance,
                    notes: reason,
                },
            });

            logger.info('RC credits refunded successfully', {
                service: 'RCService',
                method: 'refundRC',
                organizationId,
                amount,
                newBalance,
            });

            return {
                id: transaction.id,
                type: transaction.type,
                amount: transaction.amount,
                balance: transaction.balance,
                notes: transaction.notes || undefined,
                createdAt: transaction.createdAt,
            };
        });
    }

    /**
     * Check if organization has sufficient RC credits
     */
    async checkBalance(organizationId: string, required: number = 1): Promise<boolean> {
        const balance = await this.getBalance(organizationId);

        // Check expiration
        if (balance.expiresAt && balance.expiresAt < new Date()) {
            return false;
        }

        return balance.totalAvailable >= required;
    }

    /**
     * Get RC transaction history
     */
    async getTransactionHistory(
        organizationId: string,
        options?: {
            limit?: number;
            offset?: number;
            type?: RCTxType;
        }
    ): Promise<RCTransaction[]> {
        const rcRecord = await prisma.respondentCredit.findUnique({
            where: { organizationId },
        });

        if (!rcRecord) {
            return [];
        }

        const transactions = await prisma.respondentCreditTx.findMany({
            where: {
                creditId: rcRecord.id,
                ...(options?.type && { type: options.type }),
            },
            orderBy: { createdAt: 'desc' },
            take: options?.limit || 50,
            skip: options?.offset || 0,
        });

        return transactions.map((tx) => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            balance: tx.balance,
            assessmentId: tx.assessmentId || undefined,
            respondentId: tx.respondentId || undefined,
            notes: tx.notes || undefined,
            createdAt: tx.createdAt,
        }));
    }

    /**
     * Get RC usage report for a date range
     */
    async getUsageReport(
        organizationId: string,
        startDate: Date,
        endDate: Date
    ): Promise<RCUsageReport> {
        const rcRecord = await prisma.respondentCredit.findUnique({
            where: { organizationId },
        });

        if (!rcRecord) {
            return {
                period: { start: startDate, end: endDate },
                totalUsed: 0,
                totalPurchased: 0,
                transactions: [],
                usageByAssessment: [],
            };
        }

        const transactions = await prisma.respondentCreditTx.findMany({
            where: {
                creditId: rcRecord.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const totalUsed = transactions
            .filter((tx) => tx.type === RCTxType.USAGE)
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        const totalPurchased = transactions
            .filter((tx) => tx.type === RCTxType.PURCHASE)
            .reduce((sum, tx) => sum + tx.amount, 0);

        // Group usage by assessment
        const usageByAssessment = transactions
            .filter((tx) => tx.type === RCTxType.USAGE && tx.assessmentId)
            .reduce((acc, tx) => {
                const existing = acc.find((item) => item.assessmentId === tx.assessmentId);
                if (existing) {
                    existing.respondentCount++;
                } else {
                    acc.push({
                        assessmentId: tx.assessmentId!,
                        respondentCount: 1,
                    });
                }
                return acc;
            }, [] as { assessmentId: string; respondentCount: number }[]);

        return {
            period: { start: startDate, end: endDate },
            totalUsed,
            totalPurchased,
            transactions: transactions.map((tx) => ({
                id: tx.id,
                type: tx.type,
                amount: tx.amount,
                balance: tx.balance,
                assessmentId: tx.assessmentId || undefined,
                respondentId: tx.respondentId || undefined,
                notes: tx.notes || undefined,
                createdAt: tx.createdAt,
            })),
            usageByAssessment,
        };
    }
}

// Export singleton instance
export const rcService = new RCService();
