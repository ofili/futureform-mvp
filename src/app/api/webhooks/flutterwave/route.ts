import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get('verif-hash');
        if (!signature || signature !== process.env.FLW_SECRET_HASH) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = await request.json();
        const { event, data } = payload;

        console.log('Flutterwave Webhook received:', event, data);

        // Handle specific events
        if (event === 'charge.completed' && data.status === 'successful') {
            // Find user by email (assuming customer.email is present)
            const user = await prisma.user.findUnique({
                where: { email: data.customer.email },
            });

            if (user) {
                // Logic to credit user account or update subscription
                // For MVP, we'll just log it. In production, create a CreditTransaction.
                console.log(`Payment successful for user: ${user.email}`);

                // Example: Add credits
                // await prisma.credit.create({ ... })
            }
        } else if (event === 'transfer.failed' || (event === 'charge.completed' && data.status === 'failed')) {
            // Handle payment failure
            console.log('Payment failed:', data);

            // TODO: Send email notification using emailService
            // const { sendEmail } = await import('@/lib/services/emailService');
            // await sendEmail({ ... });
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Flutterwave webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
