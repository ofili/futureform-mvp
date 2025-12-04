// Flutterwave webhook handler
import { NextRequest, NextResponse } from 'next/server';
import { flutterwaveService } from '@/lib/payments/flutterwave.service';
import { paymentService } from '@/services/payments/payment.service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        // Get webhook signature from headers
        const signature = request.headers.get('verif-hash');

        if (!signature) {
            logger.warn('Webhook received without signature', {
                service: 'FlutterwaveWebhook',
                method: 'POST',
            });
            return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
        }

        // Get raw body for signature verification
        const rawBody = await request.text();

        // Verify webhook signature
        const isValid = flutterwaveService.verifyWebhookSignature(rawBody, signature);

        if (!isValid) {
            logger.warn('Invalid webhook signature', {
                service: 'FlutterwaveWebhook',
                method: 'POST',
            });
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse the payload
        const payload = JSON.parse(rawBody);

        logger.info('Webhook received', {
            service: 'FlutterwaveWebhook',
            method: 'POST',
            event: payload.event,
            txRef: payload.data?.tx_ref,
        });

        // Delegate to service layer
        await paymentService.processWebhook(payload);

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        logger.error('Webhook processing failed', error as Error, {
            service: 'FlutterwaveWebhook',
            method: 'POST',
        });

        // Return 200 to prevent Flutterwave from retrying on our errors
        // Log the error for manual investigation
        return NextResponse.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Processing failed' },
            { status: 200 }
        );
    }
}
