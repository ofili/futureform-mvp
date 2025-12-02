// Billing Service
// Handles payment processing and credit purchases

import prisma from '@/lib/prisma';
import { PaymentError } from '@/lib/errors/credit-errors';
import { logger } from '@/lib/logger';
import { rcService } from '../credits/rc.service';
import { ecService } from '../credits/ec.service';
import { packageService } from '../credits/package.service';
import { PackageType } from '@prisma/client';

export interface PaymentInfo {
    method: 'card' | 'bank_transfer' | 'mobile_money';
    provider?: string;
    transactionId?: string;
    metadata?: Record<string, any>;
}

export interface PurchaseResult {
    success: boolean;
    rcCreditsAdded?: number;
    ecCreditsAdded?: number;
    transactionIds: string[];
    totalAmount: number;
}

export class BillingService {
    /**
     * Process package purchase
     */
    async purchasePackage(
        organizationId: string,
        packageId: string,
        paymentInfo: PaymentInfo
    ): Promise<PurchaseResult> {
        logger.info('Processing package purchase', {
            service: 'BillingService',
            method: 'purchasePackage',
            organizationId,
            packageId,
            paymentMethod: paymentInfo.method,
        });

        // Get package details
        const pkg = await packageService.getPackageById(packageId);

        // TODO: Process payment with payment provider
        // For now, we'll assume payment is successful
        const paymentSuccessful = true;

        if (!paymentSuccessful) {
            throw new PaymentError('Payment processing failed', paymentInfo.provider);
        }

        const transactionIds: string[] = [];
        let rcCreditsAdded = 0;
        let ecCreditsAdded = 0;
        let totalAmount = pkg.priceUSD;

        // Add credits based on package type
        switch (pkg.type) {
            case PackageType.RC:
                const rcTx = await rcService.purchaseRC(
                    organizationId,
                    pkg.creditAmount,
                    packageId,
                    `Purchased ${pkg.name}`
                );
                transactionIds.push(rcTx.id);
                rcCreditsAdded = pkg.creditAmount;
                break;

            case PackageType.EC:
                const ecTx = await ecService.purchaseEC(
                    organizationId,
                    pkg.creditAmount,
                    packageId,
                    `Purchased ${pkg.name}`
                );
                transactionIds.push(ecTx.id);
                ecCreditsAdded = pkg.creditAmount;
                break;

            case PackageType.COMBINED:
                // Combined packages would need additional fields in schema
                // For now, treat as RC or EC based on creditAmount
                logger.warn('Combined package type not fully implemented', {
                    service: 'BillingService',
                    method: 'purchasePackage',
                    packageId,
                });
                break;

            case PackageType.SUBSCRIPTION:
                // TODO: Handle subscription logic
                logger.warn('Subscription purchases not yet implemented', {
                    service: 'BillingService',
                    method: 'purchasePackage',
                    packageId,
                });
                break;
        }

        logger.info('Package purchase completed successfully', {
            service: 'BillingService',
            method: 'purchasePackage',
            organizationId,
            packageId,
            rcCreditsAdded,
            ecCreditsAdded,
            totalAmount,
        });

        return {
            success: true,
            rcCreditsAdded: rcCreditsAdded > 0 ? rcCreditsAdded : undefined,
            ecCreditsAdded: ecCreditsAdded > 0 ? ecCreditsAdded : undefined,
            transactionIds,
            totalAmount,
        };
    }

    /**
     * Purchase custom RC amount
     */
    async purchaseCustomRC(
        organizationId: string,
        amount: number,
        pricePerCredit: number,
        paymentInfo: PaymentInfo
    ): Promise<PurchaseResult> {
        logger.info('Processing custom RC purchase', {
            service: 'BillingService',
            method: 'purchaseCustomRC',
            organizationId,
            amount,
            pricePerCredit,
        });

        // TODO: Process payment
        const paymentSuccessful = true;

        if (!paymentSuccessful) {
            throw new PaymentError('Payment processing failed', paymentInfo.provider);
        }

        const rcTx = await rcService.purchaseRC(
            organizationId,
            amount,
            undefined,
            'Custom RC purchase'
        );

        return {
            success: true,
            rcCreditsAdded: amount,
            transactionIds: [rcTx.id],
            totalAmount: amount * pricePerCredit,
        };
    }

    /**
     * Purchase custom EC amount
     */
    async purchaseCustomEC(
        organizationId: string,
        amount: number,
        pricePerCredit: number,
        paymentInfo: PaymentInfo
    ): Promise<PurchaseResult> {
        logger.info('Processing custom EC purchase', {
            service: 'BillingService',
            method: 'purchaseCustomEC',
            organizationId,
            amount,
            pricePerCredit,
        });

        // TODO: Process payment
        const paymentSuccessful = true;

        if (!paymentSuccessful) {
            throw new PaymentError('Payment processing failed', paymentInfo.provider);
        }

        const ecTx = await ecService.purchaseEC(
            organizationId,
            amount,
            undefined,
            'Custom EC purchase'
        );

        return {
            success: true,
            ecCreditsAdded: amount,
            transactionIds: [ecTx.id],
            totalAmount: amount * pricePerCredit,
        };
    }
}

// Export singleton instance
export const billingService = new BillingService();
