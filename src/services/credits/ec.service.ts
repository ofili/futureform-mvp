// Evidence Credits Service
// Handles all business logic for EC (Evidence Credits) management

import prisma from '@/lib/prisma';
import { InsufficientCreditsError, CreditExpiredError } from '@/lib/errors/credit-errors';
import { logger } from '@/lib/logger';
import { ECTxType, EvidenceLayer, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface ECBalance {
    totalPurchased: Decimal;
    totalUsed: Decimal;
    totalAvailable: Decimal;
    expiresAt: Date | null;
    autoReloadEnabled: boolean;
    autoReloadThreshold: Decimal | null;
    autoReloadAmount: Decimal | null;
}

export interface ECTransaction {
    id: string;
    type: ECTxType;
    amount: Decimal;
    balance: Decimal;
    evidenceType?: string;
    evidenceId?: string;
    assessmentId?: string;
    notes?: string;
    createdAt: Date;
}

export interface ECPricingInfo {
    evidenceType: string;
    layer: EvidenceLayer;
    costPerUnit: Decimal;
    description: string | null;
}

export interface ECUsageByType {
    evidenceType: string;
    count: number;
    totalCost: Decimal;
}

export class ECService {
    /**
     * Get EC balance for an organization
     */
    async getBalance(organizationId: string): Promise<ECBalance> {
        logger.debug('Getting EC balance', {
            service: 'ECService',
            method: 'getBalance',
            organizationId,
        });

        let ecRecord = await prisma.evidenceCredit.findUnique({
            where: { organizationId },
        });

        // Create EC record if it doesn't exist
        if (!ecRecord) {
            ecRecord = await prisma.evidenceCredit.create({
                data: {
                    organizationId,
                    totalPurchased: new Decimal(0),
                    totalUsed: new Decimal(0),
                    totalAvailable: new Decimal(0),
                },
            });
        }

        return {
            totalPurchased: ecRecord.totalPurchased,
            totalUsed: ecRecord.totalUsed,
            totalAvailable: ecRecord.totalAvailable,
            expiresAt: ecRecord.expiresAt,
            autoReloadEnabled: ecRecord.autoReloadEnabled,
            autoReloadThreshold: ecRecord.autoReloadThreshold,
            autoReloadAmount: ecRecord.autoReloadAmount,
        };
    }

    /**
     * Purchase EC credits
     */
    async purchaseEC(
        organizationId: string,
        amount: number,
        packageId?: string,
        notes?: string
    ): Promise<ECTransaction> {
        logger.info('Purchasing EC credits', {
            service: 'ECService',
            method: 'purchaseEC',
            organizationId,
            amount,
            packageId,
        });

        if (amount <= 0) {
            throw new Error('Purchase amount must be positive');
        }

        const amountDecimal = new Decimal(amount);

        return await prisma.$transaction(async (tx) => {
            // Get or create EC record
            let ecRecord = await tx.evidenceCredit.findUnique({
                where: { organizationId },
            });

            if (!ecRecord) {
                ecRecord = await tx.evidenceCredit.create({
                    data: {
                        organizationId,
                        totalPurchased: new Decimal(0),
                        totalUsed: new Decimal(0),
                        totalAvailable: new Decimal(0),
                    },
                });
            }

            // Update balances
            const newBalance = new Decimal(ecRecord.totalAvailable).plus(amountDecimal);
            await tx.evidenceCredit.update({
                where: { organizationId },
                data: {
                    totalPurchased: { increment: amountDecimal },
                    totalAvailable: newBalance,
                },
            });

            // Create transaction record
            const transaction = await tx.evidenceCreditTx.create({
                data: {
                    creditId: ecRecord.id,
                    type: ECTxType.PURCHASE,
                    amount: amountDecimal,
                    balance: newBalance,
                    packageId,
                    notes,
                },
            });

            logger.info('EC credits purchased successfully', {
                service: 'ECService',
                method: 'purchaseEC',
                organizationId,
                amount,
                newBalance: newBalance.toString(),
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
     * Consume EC credits (when evidence is submitted)
     */
    async consumeEC(
        organizationId: string,
        evidenceType: string,
        evidenceId?: string,
        assessmentId?: string,
        notes?: string,
        tx?: Prisma.TransactionClient
    ): Promise<ECTransaction> {
        logger.info('Consuming EC credits', {
            service: 'ECService',
            method: 'consumeEC',
            organizationId,
            evidenceType,
            evidenceId,
        });

        // Get pricing for evidence type
        const cost = await this.getECPricingByType(evidenceType);

        const executeConsume = async (transaction: Prisma.TransactionClient) => {
            const ecRecord = await transaction.evidenceCredit.findUnique({
                where: { organizationId },
            });

            if (!ecRecord) {
                throw new InsufficientCreditsError('EC', cost.toNumber(), 0);
            }

            // Check if credits have expired
            if (ecRecord.expiresAt && ecRecord.expiresAt < new Date()) {
                throw new CreditExpiredError('EC');
            }

            // Check if sufficient credits available
            if (new Decimal(ecRecord.totalAvailable).lessThan(cost)) {
                throw new InsufficientCreditsError(
                    'EC',
                    cost.toNumber(),
                    ecRecord.totalAvailable.toNumber()
                );
            }

            // Update balances
            const newBalance = new Decimal(ecRecord.totalAvailable).minus(cost);
            await transaction.evidenceCredit.update({
                where: { organizationId },
                data: {
                    totalUsed: { increment: cost },
                    totalAvailable: newBalance,
                },
            });

            // Create transaction record
            const transactionRecord = await transaction.evidenceCreditTx.create({
                data: {
                    creditId: ecRecord.id,
                    type: ECTxType.USAGE,
                    amount: cost.negated(),
                    balance: newBalance,
                    evidenceType,
                    evidenceId,
                    assessmentId,
                    notes,
                },
            });

            logger.info('EC credits consumed successfully', {
                service: 'ECService',
                method: 'consumeEC',
                organizationId,
                evidenceType,
                cost: cost.toString(),
                newBalance: newBalance.toString(),
            });

            // Check if auto-reload is needed
            if (ecRecord.autoReloadEnabled && ecRecord.autoReloadThreshold && ecRecord.autoReloadAmount) {
                if (newBalance.lessThanOrEqualTo(ecRecord.autoReloadThreshold)) {
                    logger.info('Auto-reload threshold reached, triggering reload', {
                        service: 'ECService',
                        method: 'consumeEC',
                        organizationId,
                        threshold: ecRecord.autoReloadThreshold.toString(),
                        reloadAmount: ecRecord.autoReloadAmount.toString(),
                    });
                    // Note: Actual payment processing would happen here
                    // For now, we just log it
                }
            }

            return {
                id: transactionRecord.id,
                type: transactionRecord.type,
                amount: transactionRecord.amount,
                balance: transactionRecord.balance,
                evidenceType: transactionRecord.evidenceType || undefined,
                evidenceId: transactionRecord.evidenceId || undefined,
                assessmentId: transactionRecord.assessmentId || undefined,
                notes: transactionRecord.notes || undefined,
                createdAt: transactionRecord.createdAt,
            };
        };

        if (tx) {
            return executeConsume(tx);
        } else {
            return await prisma.$transaction(executeConsume);
        }
    }

    /**
     * Calculate EC cost for evidence type and quantity
     */
    async calculateECCost(evidenceType: string, quantity: number = 1): Promise<number> {
        const costPerUnit = await this.getECPricingByType(evidenceType);
        return costPerUnit.times(quantity).toNumber();
    }

    /**
     * Get EC pricing by evidence type
     */
    async getECPricingByType(evidenceType: string): Promise<Decimal> {
        const pricing = await prisma.eCPricing.findUnique({
            where: { evidenceType, isActive: true },
        });

        if (!pricing) {
            logger.warn('No pricing found for evidence type, using default', {
                service: 'ECService',
                method: 'getECPricingByType',
                evidenceType,
            });
            return new Decimal(1); // Default cost
        }

        return pricing.costPerUnit;
    }

    /**
     * Get all EC pricing
     */
    async getECPricing(): Promise<ECPricingInfo[]> {
        const pricing = await prisma.eCPricing.findMany({
            where: { isActive: true },
            orderBy: [{ layer: 'asc' }, { displayOrder: 'asc' }],
        });

        return pricing.map((p) => ({
            evidenceType: p.evidenceType,
            layer: p.layer,
            costPerUnit: p.costPerUnit,
            description: p.description,
        }));
    }

    /**
     * Setup auto-reload for EC
     */
    async setupAutoReload(
        organizationId: string,
        threshold: number,
        reloadAmount: number
    ): Promise<void> {
        logger.info('Setting up EC auto-reload', {
            service: 'ECService',
            method: 'setupAutoReload',
            organizationId,
            threshold,
            reloadAmount,
        });

        await prisma.evidenceCredit.upsert({
            where: { organizationId },
            create: {
                organizationId,
                totalPurchased: new Decimal(0),
                totalUsed: new Decimal(0),
                totalAvailable: new Decimal(0),
                autoReloadEnabled: true,
                autoReloadThreshold: new Decimal(threshold),
                autoReloadAmount: new Decimal(reloadAmount),
            },
            update: {
                autoReloadEnabled: true,
                autoReloadThreshold: new Decimal(threshold),
                autoReloadAmount: new Decimal(reloadAmount),
            },
        });

        logger.info('EC auto-reload configured successfully', {
            service: 'ECService',
            method: 'setupAutoReload',
            organizationId,
        });
    }

    /**
     * Disable auto-reload
     */
    async disableAutoReload(organizationId: string): Promise<void> {
        await prisma.evidenceCredit.update({
            where: { organizationId },
            data: {
                autoReloadEnabled: false,
            },
        });
    }

    /**
     * Check if organization has sufficient EC credits
     */
    async checkBalance(organizationId: string, required: number): Promise<boolean> {
        const balance = await this.getBalance(organizationId);

        // Check expiration
        if (balance.expiresAt && balance.expiresAt < new Date()) {
            return false;
        }

        return new Decimal(balance.totalAvailable).greaterThanOrEqualTo(required);
    }

    /**
     * Get EC transaction history
     */
    async getTransactionHistory(
        organizationId: string,
        options?: {
            limit?: number;
            offset?: number;
            type?: ECTxType;
            evidenceType?: string;
        }
    ): Promise<ECTransaction[]> {
        const ecRecord = await prisma.evidenceCredit.findUnique({
            where: { organizationId },
        });

        if (!ecRecord) {
            return [];
        }

        const transactions = await prisma.evidenceCreditTx.findMany({
            where: {
                creditId: ecRecord.id,
                ...(options?.type && { type: options.type }),
                ...(options?.evidenceType && { evidenceType: options.evidenceType }),
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
            evidenceType: tx.evidenceType || undefined,
            evidenceId: tx.evidenceId || undefined,
            assessmentId: tx.assessmentId || undefined,
            notes: tx.notes || undefined,
            createdAt: tx.createdAt,
        }));
    }

    /**
     * Get EC usage by evidence type
     */
    async getUsageByType(
        organizationId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<ECUsageByType[]> {
        const ecRecord = await prisma.evidenceCredit.findUnique({
            where: { organizationId },
        });

        if (!ecRecord) {
            return [];
        }

        const transactions = await prisma.evidenceCreditTx.findMany({
            where: {
                creditId: ecRecord.id,
                type: ECTxType.USAGE,
                evidenceType: { not: null },
                ...(startDate && endDate && {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                }),
            },
        });

        // Group by evidence type
        const usageMap = new Map<string, { count: number; totalCost: Decimal }>();

        for (const tx of transactions) {
            if (!tx.evidenceType) continue;

            const existing = usageMap.get(tx.evidenceType);
            if (existing) {
                existing.count++;
                existing.totalCost = existing.totalCost.plus(tx.amount.abs());
            } else {
                usageMap.set(tx.evidenceType, {
                    count: 1,
                    totalCost: tx.amount.abs(),
                });
            }
        }

        return Array.from(usageMap.entries()).map(([evidenceType, data]) => ({
            evidenceType,
            count: data.count,
            totalCost: data.totalCost,
        }));
    }
}

// Export singleton instance
export const ecService = new ECService();
