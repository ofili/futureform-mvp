// Flutterwave payment service
import Flutterwave from 'flutterwave-node-v3';
import crypto from 'crypto';
import {
    PaymentInitRequest,
    PaymentInitResponse,
    FlutterwavePaymentData,
    FlutterwaveVerifyResponse,
    WebhookPayload,
    PaymentMetadata,
} from './payment.types';
import { logger } from '@/lib/logger';

class FlutterwaveService {
    private flw: any;
    private publicKey: string;
    private secretKey: string;
    private encryptionKey: string;
    private webhookSecret: string;

    constructor() {
        this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY || '';
        this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';
        this.encryptionKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY || '';
        this.webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET || '';

        if (!this.secretKey || !this.publicKey) {
            logger.warn('Flutterwave keys not configured. Payment features will not work.');
        }

        this.flw = new Flutterwave(this.publicKey, this.secretKey);
    }

    /**
     * Initialize a payment transaction
     */
    async initializePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
        try {
            const transactionRef = this.generateTransactionRef();
            const successUrl = process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL || 'http://localhost:3000/billing/success';
            const cancelUrl = process.env.NEXT_PUBLIC_PAYMENT_CANCEL_URL || 'http://localhost:3000/billing/cancel';

            const metadata: PaymentMetadata = {
                organizationId: request.organizationId,
                userId: '', // Will be set by API route
                type: request.type,
                tierId: request.tierId,
                packageId: request.packageId,
            };

            const paymentData: FlutterwavePaymentData = {
                tx_ref: transactionRef,
                amount: request.amount,
                currency: request.currency || 'NGN',
                redirect_url: `${successUrl}?ref=${transactionRef}`,
                customer: {
                    email: request.customerEmail,
                    name: request.customerName,
                    phonenumber: request.customerPhone,
                },
                customizations: {
                    title: this.getPaymentTitle(request.type),
                    description: this.getPaymentDescription(request),
                    logo: process.env.NEXT_PUBLIC_APP_LOGO_URL,
                },
                meta: metadata,
            };

            const response = await this.flw.Charge.card(paymentData);

            if (response.status === 'success') {
                return {
                    success: true,
                    paymentLink: response.meta.authorization.redirect,
                    transactionRef,
                    transactionId: '', // Will be set after DB insert
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
                };
            }

            throw new Error(response.message || 'Failed to initialize payment');
        } catch (error) {
            logger.error('Flutterwave payment initialization failed', error as Error);
            throw error;
        }
    }

    /**
     * Verify a payment transaction
     */
    async verifyPayment(transactionRef: string): Promise<FlutterwaveVerifyResponse> {
        try {
            const response = await this.flw.Transaction.verify({ id: transactionRef });

            if (response.status !== 'success') {
                throw new Error('Payment verification failed');
            }

            return response;
        } catch (error) {
            logger.error('Payment verification failed', error as Error);
            throw error;
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string, signature: string): boolean {
        try {
            const hash = crypto
                .createHmac('sha256', this.webhookSecret)
                .update(payload)
                .digest('hex');

            return hash === signature;
        } catch (error) {
            logger.error('Webhook signature verification failed', error as Error);
            return false;
        }
    }

    /**
     * Process webhook payload
     */
    async processWebhook(payload: WebhookPayload): Promise<void> {
        try {
            const { event, data } = payload;

            switch (event) {
                case 'charge.completed':
                    if (data.status === 'successful') {
                        logger.info(`Payment completed: ${data.tx_ref}`);
                        // Webhook handler will process the payment
                    }
                    break;

                case 'charge.failed':
                    logger.warn(`Payment failed: ${data.tx_ref}`);
                    break;

                case 'refund.completed':
                    logger.info(`Refund completed: ${data.tx_ref}`);
                    break;

                default:
                    logger.warn(`Unknown webhook event: ${event}`);
            }
        } catch (error) {
            logger.error('Webhook processing failed', error as Error);
            throw error;
        }
    }

    /**
     * Generate unique transaction reference
     */
    private generateTransactionRef(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `FTF-${timestamp}-${random}`.toUpperCase();
    }

    /**
     * Get payment title based on type
     */
    private getPaymentTitle(type: string): string {
        switch (type) {
            case 'TIER_UPGRADE':
                return 'FutureForm - Subscription Upgrade';
            case 'RC_PURCHASE':
                return 'FutureForm - Respondent Credits';
            case 'EC_PURCHASE':
                return 'FutureForm - Evidence Credits';
            default:
                return 'FutureForm Payment';
        }
    }

    /**
     * Get payment description
     */
    private getPaymentDescription(request: PaymentInitRequest): string {
        switch (request.type) {
            case 'TIER_UPGRADE':
                return 'Upgrade your subscription tier';
            case 'RC_PURCHASE':
                return 'Purchase Respondent Credits package';
            case 'EC_PURCHASE':
                return 'Purchase Evidence Credits package';
            default:
                return 'Payment for FutureForm services';
        }
    }
}

export const flutterwaveService = new FlutterwaveService();
