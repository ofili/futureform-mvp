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

        const transactionIds: string[] = [];
        let rcCreditsAdded = 0;
        let ecCreditsAdded = 0;
        const totalAmount = Number(pkg.priceUSD);

        // Add credits based on package type
        switch (pkg.type) {
            case PackageType.RC_ONLY:
                if (!pkg.creditAmount) {
                    throw new Error('RC_ONLY package missing creditAmount');
                }
                const rcTx = await rcService.purchaseRC(
                    organizationId,
                    pkg.creditAmount,
                    packageId,
                    `Purchased ${pkg.packageName}`
                );
                transactionIds.push(rcTx.id);
                rcCreditsAdded = pkg.creditAmount;
                break;

            case PackageType.EC_ONLY:
                if (!pkg.creditAmount) {
                    throw new Error('EC_ONLY package missing creditAmount');
                }
                const ecTx = await ecService.purchaseEC(
                    organizationId,
                    pkg.creditAmount,
                    packageId,
                    `Purchased ${pkg.packageName}`
                );
                transactionIds.push(ecTx.id);
                ecCreditsAdded = pkg.creditAmount;
                break;

            case PackageType.COMBINED:
                if (!pkg.rcAmount || !pkg.ecAmount) {
                    throw new Error('COMBINED package missing rcAmount or ecAmount');
                }
                
                // Add RC credits
                const combinedRcTx = await rcService.purchaseRC(
                    organizationId,
                    pkg.rcAmount,
                    packageId,
                    `Purchased ${pkg.packageName} - RC portion`
                );
                transactionIds.push(combinedRcTx.id);
                rcCreditsAdded = pkg.rcAmount;
                
                // Add EC credits
                const combinedEcTx = await ecService.purchaseEC(
                    organizationId,
                    pkg.ecAmount,
                    packageId,
                    `Purchased ${pkg.packageName} - EC portion`
                );
                transactionIds.push(combinedEcTx.id);
                ecCreditsAdded = pkg.ecAmount;
                
                logger.info('Combined package processed', {
                    service: 'BillingService',
                    method: 'purchasePackage',
                    packageId,
                    rcAmount: pkg.rcAmount,
                    ecAmount: pkg.ecAmount,
                });
                break;

            case PackageType.SUBSCRIPTION:
                if (!pkg.tierId) {
                    throw new Error('SUBSCRIPTION package missing tierId');
                }
                
                // Upgrade organization tier
                await prisma.organization.update({
                    where: { id: organizationId },
                    data: { tierId: pkg.tierId }
                });
                
                logger.info('Subscription activated', {
                    service: 'BillingService',
                    method: 'purchasePackage',
                    organizationId,
                    tierId: pkg.tierId,
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

    /**
     * Process successful payment from Flutterwave
     */
    async processSuccessfulPayment(transactionId: string): Promise<void> {
        logger.info('Processing successful payment', {
            service: 'BillingService',
            method: 'processSuccessfulPayment',
            transactionId,
        });

        // Get transaction details
        const transaction = await prisma.paymentTransaction.findUnique({
            where: { id: transactionId },
            include: {
                organization: true,
                package: true,
                tier: true,
            },
        });

        if (!transaction) {
            throw new Error(`Transaction not found: ${transactionId}`);
        }

        // Process based on payment type
        switch (transaction.type) {
            case 'TIER_UPGRADE':
                if (!transaction.tierId) {
                    throw new Error('Tier ID missing for tier upgrade');
                }

                // Update organization tier
                await prisma.organization.update({
                    where: { id: transaction.organizationId },
                    data: { tierId: transaction.tierId },
                });

                logger.info('Tier upgraded successfully', {
                    service: 'BillingService',
                    method: 'processSuccessfulPayment',
                    organizationId: transaction.organizationId,
                    tierId: transaction.tierId,
                });
                break;

            case 'RC_PURCHASE':
                if (!transaction.package) {
                    throw new Error('Package not found for RC purchase');
                }

                // Add RC credits
                const rcAmount = transaction.package.rcAmount || transaction.package.creditAmount;
                if (!rcAmount) {
                    throw new Error('RC amount not found in package');
                }

                await rcService.purchaseRC(
                    transaction.organizationId,
                    rcAmount,
                    transaction.packageId!,
                    `Purchased ${transaction.package.name} via Flutterwave`
                );

                logger.info('RC credits added successfully', {
                    service: 'BillingService',
                    method: 'processSuccessfulPayment',
                    organizationId: transaction.organizationId,
                    amount: rcAmount,
                });
                break;

            case 'EC_PURCHASE':
                if (!transaction.package) {
                    throw new Error('Package not found for EC purchase');
                }

                // Add EC credits
                const ecAmount = transaction.package.ecAmount || transaction.package.creditAmount;
                if (!ecAmount) {
                    throw new Error('EC amount not found in package');
                }

                await ecService.purchaseEC(
                    transaction.organizationId,
                    Number(ecAmount),
                    transaction.packageId!,
                    `Purchased ${transaction.package.name} via Flutterwave`
                );

                logger.info('EC credits added successfully', {
                    service: 'BillingService',
                    method: 'processSuccessfulPayment',
                    organizationId: transaction.organizationId,
                    amount: ecAmount,
                });
                break;

            default:
                throw new Error(`Unknown payment type: ${transaction.type}`);
        }

        logger.info('Payment processed successfully', {
            service: 'BillingService',
            method: 'processSuccessfulPayment',
            transactionId,
            type: transaction.type,
        });
    }

    /**
     * Get active subscription tiers
     */
    async getSubscriptionTiers() {
        logger.info('Fetching subscription tiers', {
            service: 'BillingService',
            method: 'getSubscriptionTiers',
        });

        const tiers = await prisma.subscriptionTier.findMany({
            where: { isActive: true },
            include: {
                features: {
                    orderBy: { displayOrder: 'asc' }
                }
            },
            orderBy: { displayOrder: 'asc' }
        });

        return tiers.map(tier => ({
            ...tier,
            priceUSD: tier.priceUSD ? Number(tier.priceUSD) : null
        }));
    }

    /**
     * Get active credit packages (for UI display)
     */
    async getCreditPackages() {
        logger.info('Fetching credit packages', {
            service: 'BillingService',
            method: 'getCreditPackages',
        });

        const packages = await prisma.creditPricing.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' }
        });

        return packages.map(pkg => ({
            ...pkg,
            priceUSD: Number(pkg.priceUSD)
        }));
    }

    /**
     * Get organization's credit balance
     */
    async getCreditBalance(organizationId: string) {
        logger.info('Fetching credit balance', {
            service: 'BillingService',
            method: 'getCreditBalance',
            organizationId,
        });

        const creditAccount = await prisma.credit.findFirst({
            where: { organizationId }
        });

        return {
            balance: creditAccount?.amount || 0
        };
    }

    /**
     * Get organization's billing history
     */
    async getBillingHistory(organizationId: string) {
        logger.info('Fetching billing history', {
            service: 'BillingService',
            method: 'getBillingHistory',
            organizationId,
        });

        const creditAccount = await prisma.credit.findFirst({
            where: { organizationId }
        });

        if (!creditAccount) {
            return { payments: [] };
        }

        const transactions = await prisma.creditTransaction.findMany({
            where: { creditId: creditAccount.id },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        const payments = transactions.map(tx => ({
            id: tx.id,
            amount: tx.creditsChange,
            status: 'COMPLETED',
            createdAt: tx.createdAt,
            type: tx.type,
            user: `${tx.user.firstName} ${tx.user.lastName}`
        }));

        return { payments };
    }

    /**
     * Initiate Flutterwave checkout
     */
    async initiateFlutterwaveCheckout(
        credits: number | undefined,
        tierId: string | undefined,
        organizationId: string,
        userId: string,
        userEmail: string,
        userName?: string
    ) {
        logger.info('Initiating Flutterwave checkout', {
            service: 'BillingService',
            method: 'initiateFlutterwaveCheckout',
            organizationId,
            userId,
            credits,
            tierId,
        });

        const tx_ref = `tx-${organizationId}-${Date.now()}`;

        let amount = 0;
        let currency = 'USD';
        let paymentTitle = '';
        let metaData: any = {
            userId,
            organizationId,
        };

        if (tierId) {
            const tier = await prisma.subscriptionTier.findUnique({
                where: { id: tierId }
            });

            if (!tier) {
                throw new Error('Invalid subscription tier');
            }

            if (!tier.priceUSD) {
                throw new Error('This tier requires contacting sales');
            }

            amount = Number(tier.priceUSD);
            paymentTitle = `Upgrade to ${tier.displayName}`;
            metaData.tierId = tierId;
            metaData.type = 'SUBSCRIPTION_UPGRADE';

        } else if (credits) {
            const packageOption = await prisma.creditPricing.findFirst({
                where: { creditAmount: credits, type: 'RESPONDENT_BUNDLE', isActive: true }
            });

            if (!packageOption) {
                throw new Error('Invalid credit package');
            }

            amount = Number(packageOption.priceUSD);
            paymentTitle = `FutureForm Credits (${credits})`;
            metaData.credits = credits;
            metaData.packageId = packageOption.id;
            metaData.type = 'CREDIT_PURCHASE';
        } else {
            throw new Error('Invalid request parameters');
        }

        const flwPayload = {
            tx_ref,
            amount,
            currency,
            redirect_url: `${process.env.NEXTAUTH_URL}/dashboard/credits?success=true`,
            customer: {
                email: userEmail,
                name: userName || 'FutureForm User',
            },
            customizations: {
                title: paymentTitle,
                logo: 'https://futureform.africa/logo.png'
            },
            meta: metaData
        };

        const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flwPayload)
        });

        const flwData = await flwResponse.json();

        if (flwData.status !== 'success') {
            logger.error('Flutterwave error', flwData);
            throw new Error('Payment initialization failed');
        }

        return {
            success: true,
            url: flwData.data.link,
            message: 'Redirecting to payment gateway'
        };
    }

    /**
     * Verify user has permission to make purchases
     */
    verifyPurchasePermission(userRole: string, orgRole?: string): boolean {
        const isGlobalAdmin = userRole === 'ADMIN';
        const allowedOrgRoles = ['CREDIT_MANAGER', 'ADMIN', 'OWNER'];
        const isAllowedOrgRole = orgRole && allowedOrgRoles.includes(orgRole);

        return isGlobalAdmin || !!isAllowedOrgRole;
    }
}

// Export singleton instance
export const billingService = new BillingService();
