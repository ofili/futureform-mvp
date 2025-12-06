// Payment service - handles all payment business logic
import prisma from '@/lib/prisma';
import { flutterwaveService } from '@/lib/payments/flutterwave.service';
import { billingService } from '@/services/billing/billing.service';
import { logger } from '@/lib/logger';
import {
    PaymentInitRequest,
    PaymentInitResponse,
    PaymentVerificationResponse,
    PaymentStatus,
    WebhookPayload,
} from '@/lib/payments/payment.types';

export class PaymentService {
    /**
     * Initialize a new payment transaction
     */
    async initializePayment(
        userId: string,
        request: PaymentInitRequest
    ): Promise<PaymentInitResponse> {
        logger.info('Initializing payment', {
            service: 'PaymentService',
            method: 'initializePayment',
            userId,
            type: request.type,
            amount: request.amount,
        });

        // Get organization details
        const organization = await prisma.organization.findUnique({
            where: { id: request.organizationId },
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        // Initialize payment with Flutterwave
        const paymentInit = await flutterwaveService.initializePayment(request);

        // Create payment transaction record
        const transaction = await (prisma as any).paymentTransaction.create({
            data: {
                organizationId: request.organizationId,
                userId,
                type: request.type,
                amount: request.amount,
                currency: request.currency || 'NGN',
                status: 'PENDING',
                transactionRef: paymentInit.transactionRef,
                paymentLink: paymentInit.paymentLink,
                tierId: request.tierId,
                packageId: request.packageId,
                metadata: {
                    type: request.type,
                    organizationName: organization.name,
                    userName: request.customerName,
                },
            },
        });

        logger.info('Payment initialized successfully', {
            service: 'PaymentService',
            method: 'initializePayment',
            transactionId: transaction.id,
            transactionRef: transaction.transactionRef,
        });

        return {
            success: true,
            paymentLink: paymentInit.paymentLink,
            transactionRef: paymentInit.transactionRef,
            transactionId: transaction.id,
            expiresAt: paymentInit.expiresAt,
        };
    }

    /**
     * Verify a payment transaction
     */
    async verifyPayment(
        userId: string,
        transactionRef: string
    ): Promise<PaymentVerificationResponse> {
        logger.info('Verifying payment', {
            service: 'PaymentService',
            method: 'verifyPayment',
            userId,
            transactionRef,
        });

        // Find transaction in database
        const transaction = await (prisma as any).paymentTransaction.findUnique({
            where: { transactionRef },
            include: {
                organization: true,
                user: true,
                tier: true,
                package: true,
            },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Authorization check
        if (transaction.userId !== userId) {
            throw new Error('Unauthorized: You do not own this transaction');
        }

        // If already completed, return existing status
        if (transaction.status === 'COMPLETED') {
            return {
                success: true,
                status: 'COMPLETED' as PaymentStatus,
                transaction: {
                    id: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    type: transaction.type,
                    metadata: transaction.metadata as any,
                    completedAt: transaction.completedAt || undefined,
                },
            };
        }

        // Verify payment with Flutterwave
        const verification = await flutterwaveService.verifyPayment(transactionRef);

        if (verification.status !== 'success') {
            await (prisma as any).paymentTransaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'FAILED',
                    failureReason: 'Payment verification failed',
                    verifiedAt: new Date(),
                },
            });

            return {
                success: false,
                status: 'FAILED' as PaymentStatus,
                transaction: {
                    id: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    type: transaction.type,
                    metadata: transaction.metadata as any,
                    failureReason: 'Payment verification failed',
                },
            };
        }

        const paymentData = verification.data;

        // Check if payment was successful
        if (paymentData.status !== 'successful') {
            const status = paymentData.status === 'failed' ? 'FAILED' : 'PENDING';

            await (prisma as any).paymentTransaction.update({
                where: { id: transaction.id },
                data: {
                    status,
                    failureReason: paymentData.status === 'failed' ? 'Payment failed' : undefined,
                    verifiedAt: new Date(),
                },
            });

            return {
                success: false,
                status: status as PaymentStatus,
                transaction: {
                    id: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    type: transaction.type,
                    metadata: transaction.metadata as any,
                    failureReason: `Payment ${paymentData.status}`,
                },
            };
        }

        // Payment successful - process it
        return await this.processVerifiedPayment(transaction.id, paymentData);
    }

    /**
     * Process a verified payment
     */
    private async processVerifiedPayment(
        transactionId: string,
        paymentData: any
    ): Promise<PaymentVerificationResponse> {
        // Update transaction to processing
        await (prisma as any).paymentTransaction.update({
            where: { id: transactionId },
            data: {
                status: 'PROCESSING',
                flutterwaveTxId: paymentData.id,
                flutterwaveTxRef: paymentData.flw_ref,
                verifiedAt: new Date(),
            },
        });

        try {
            // Process the payment (add credits/upgrade tier)
            await billingService.processSuccessfulPayment(transactionId);

            // Mark as completed
            const completedTransaction = await (prisma as any).paymentTransaction.update({
                where: { id: transactionId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });

            logger.info('Payment completed successfully', {
                service: 'PaymentService',
                method: 'processVerifiedPayment',
                transactionId,
            });

            return {
                success: true,
                status: 'COMPLETED' as PaymentStatus,
                transaction: {
                    id: completedTransaction.id,
                    amount: completedTransaction.amount,
                    currency: completedTransaction.currency,
                    type: completedTransaction.type,
                    metadata: completedTransaction.metadata as any,
                    completedAt: completedTransaction.completedAt || undefined,
                },
            };
        } catch (processingError) {
            logger.error('Payment processing failed', processingError as Error);

            await (prisma as any).paymentTransaction.update({
                where: { id: transactionId },
                data: {
                    status: 'FAILED',
                    failureReason: 'Failed to process payment',
                },
            });

            throw new Error('Failed to process payment. Please contact support.');
        }
    }

    /**
     * Process webhook event
     */
    async processWebhook(payload: WebhookPayload): Promise<void> {
        const { event, data } = payload;

        logger.info('Processing webhook', {
            service: 'PaymentService',
            method: 'processWebhook',
            event,
            txRef: data.tx_ref,
        });

        // Find the transaction
        const transaction = await (prisma as any).paymentTransaction.findUnique({
            where: { transactionRef: data.tx_ref },
        });

        if (!transaction) {
            throw new Error(`Transaction not found: ${data.tx_ref}`);
        }

        // Mark webhook as received
        await (prisma as any).paymentTransaction.update({
            where: { id: transaction.id },
            data: { webhookReceived: true },
        });

        // Handle different webhook events
        switch (event) {
            case 'charge.completed':
                if (data.status === 'successful') {
                    await this.handleSuccessfulCharge(transaction.id, data);
                }
                break;

            case 'charge.failed':
                await this.handleFailedCharge(transaction.id);
                break;

            case 'refund.completed':
                await this.handleRefund(transaction.id);
                break;

            default:
                logger.warn(`Unknown webhook event: ${event}`);
        }
    }

    /**
     * Handle successful charge webhook
     */
    private async handleSuccessfulCharge(transactionId: string, data: any): Promise<void> {
        const transaction = await (prisma as any).paymentTransaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Double-check with Flutterwave API to prevent fraud
        const verification = await flutterwaveService.verifyPayment(transaction.transactionRef);

        if (verification.data.status !== 'successful') {
            logger.warn('Webhook says successful but API verification failed', {
                service: 'PaymentService',
                method: 'handleSuccessfulCharge',
                transactionId,
                webhookStatus: data.status,
                apiStatus: verification.data.status,
            });
            return;
        }

        // Only process if not already completed
        if (transaction.status !== 'COMPLETED') {
            await this.processVerifiedPayment(transactionId, data);
        }
    }

    /**
     * Handle failed charge webhook
     */
    private async handleFailedCharge(transactionId: string): Promise<void> {
        await (prisma as any).paymentTransaction.update({
            where: { id: transactionId },
            data: {
                status: 'FAILED',
                failureReason: 'Payment failed',
                verifiedAt: new Date(),
            },
        });

        logger.info('Payment failed via webhook', {
            service: 'PaymentService',
            method: 'handleFailedCharge',
            transactionId
        });
    }

    /**
     * Handle refund webhook
     */
    private async handleRefund(transactionId: string): Promise<void> {
        await (prisma as any).paymentTransaction.update({
            where: { id: transactionId },
            data: {
                status: 'REFUNDED',
                verifiedAt: new Date(),
            },
        });

        logger.info('Refund completed via webhook', {
            service: 'PaymentService',
            method: 'handleRefund',
            transactionId
        });
    }

    /**
     * Get transaction by ID
     */
    async getTransaction(userId: string, transactionId: string) {
        const transaction = await (prisma as any).paymentTransaction.findUnique({
            where: { id: transactionId },
            include: {
                organization: true,
                package: true,
                tier: true,
            },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Authorization check
        if (transaction.userId !== userId) {
            throw new Error('Unauthorized');
        }

        return transaction;
    }

    /**
     * Get transactions for an organization
     */
    async getOrganizationTransactions(organizationId: string, limit = 50) {
        return await (prisma as any).paymentTransaction.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                package: true,
                tier: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    /**
     * Verify user has access to organization
     */
    async verifyOrganizationAccess(userId: string, organizationId: string): Promise<boolean> {
        const member = await prisma.organizationMember.findFirst({
            where: {
                userId,
                organizationId,
                deletedAt: null
            }
        });

        return !!member;
    }
}

export const paymentService = new PaymentService();
