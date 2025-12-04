// Stripe Service
// Handles Stripe payment processing for international payments

import Stripe from 'stripe';
import { logger } from '@/lib/logger';

export interface StripePaymentIntentData {
    amount: number; // in cents
    currency: string; // 'usd', 'eur', 'gbp'
    organizationId: string;
    packageId?: string;
    tierId?: string;
    metadata?: Record<string, string>;
}

export interface StripeSubscriptionData {
    organizationId: string;
    tierId: string;
    priceId: string; // Stripe price ID
    metadata?: Record<string, string>;
}

export class StripeService {
    private stripe: Stripe | null = null;

    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;

        if (!secretKey) {
            logger.warn('STRIPE_SECRET_KEY not configured', {
                service: 'StripeService',
            });
        } else {
            this.stripe = new Stripe(secretKey, {
                apiVersion: '2024-11-20.acacia',
            });
        }
    }

    /**
     * Create a payment intent for one-time payments
     */
    async createPaymentIntent(data: StripePaymentIntentData) {
        if (!this.stripe) {
            throw new Error('Stripe not configured');
        }

        logger.info('Creating Stripe payment intent', {
            service: 'StripeService',
            method: 'createPaymentIntent',
            amount: data.amount,
            currency: data.currency,
        });

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                organizationId: data.organizationId,
                ...(data.packageId && { packageId: data.packageId }),
                ...(data.tierId && { tierId: data.tierId }),
                ...data.metadata,
            },
        });

        return paymentIntent;
    }

    /**
     * Confirm a payment intent
     */
    async confirmPayment(paymentIntentId: string) {
        if (!this.stripe) {
            throw new Error('Stripe not configured');
        }

        logger.info('Confirming Stripe payment', {
            service: 'StripeService',
            method: 'confirmPayment',
            paymentIntentId,
        });

        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    }

    /**
     * Create a subscription for recurring payments
     */
    async createSubscription(data: StripeSubscriptionData) {
        if (!this.stripe) {
            throw new Error('Stripe not configured');
        }

        logger.info('Creating Stripe subscription', {
            service: 'StripeService',
            method: 'createSubscription',
            organizationId: data.organizationId,
            tierId: data.tierId,
        });

        // First, create or retrieve customer
        const customer = await this.getOrCreateCustomer(data.organizationId);

        // Create subscription
        const subscription = await this.stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: data.priceId }],
            metadata: {
                organizationId: data.organizationId,
                tierId: data.tierId,
                ...data.metadata,
            },
        });

        return subscription;
    }

    /**
     * Cancel a subscription
     */
    async cancelSubscription(subscriptionId: string) {
        if (!this.stripe) {
            throw new Error('Stripe not configured');
        }

        logger.info('Canceling Stripe subscription', {
            service: 'StripeService',
            method: 'cancelSubscription',
            subscriptionId,
        });

        const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
        return subscription;
    }

    /**
     * Get or create a Stripe customer for an organization
     */
    private async getOrCreateCustomer(organizationId: string) {
        if (!this.stripe) {
            throw new Error('Stripe not configured');
        }

        // Search for existing customer
        const customers = await this.stripe.customers.search({
            query: `metadata['organizationId']:'${organizationId}'`,
        });

        if (customers.data.length > 0) {
            return customers.data[0];
        }

        // Create new customer
        const customer = await this.stripe.customers.create({
            metadata: {
                organizationId,
            },
        });

        return customer;
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event {
        if (!this.stripe) {
            throw new Error('Stripe not configured');
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('Stripe webhook secret not configured');
        }

        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                webhookSecret
            );
            return event;
        } catch (err: any) {
            logger.error('Webhook signature verification failed', {
                service: 'StripeService',
                method: 'verifyWebhookSignature',
                error: err.message,
            });
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }

    /**
     * Check if Stripe is configured
     */
    isConfigured(): boolean {
        return this.stripe !== null;
    }
}

// Export singleton instance
export const stripeService = new StripeService();
