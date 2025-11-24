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
            const transactionId = data.id;

            // Verify transaction with Flutterwave
            const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
                const { meta, amount, currency } = verifyData.data;
                const { userId, organizationId, credits, packageId, tierId, type } = meta;

                // Check if transaction already processed (idempotency)
                const existingTx = await prisma.creditTransaction.findFirst({
                    where: { notes: { contains: `Ref: ${data.tx_ref}` } }
                });

                if (!existingTx) {
                    console.log(`Processing successful payment for user: ${userId}, type: ${type}`);

                    if (type === 'SUBSCRIPTION_UPGRADE' && tierId) {
                        // Handle Subscription Upgrade

                        // Update user tier
                        // Assuming tier is stored as a string name on the User model based on page.tsx usage
                        const tier = await prisma.subscriptionTier.findUnique({
                            where: { id: tierId }
                        });

                        if (tier) {
                            await prisma.organization.update({
                                where: { id: organizationId },
                                data: { tierId: tier.id }
                            });

                            // Get credit account for transaction history
                            let creditAccount = await prisma.credit.findFirst({
                                where: { organizationId }
                            });

                            if (!creditAccount) {
                                creditAccount = await prisma.credit.create({
                                    data: {
                                        organizationId,
                                        amount: 0,
                                        type: 'PURCHASE',
                                        description: 'Organization Credit Account'
                                    }
                                });
                            }

                            await prisma.creditTransaction.create({
                                data: {
                                    creditId: creditAccount.id,
                                    userId: userId,
                                    type: 'PURCHASE',
                                    creditsChange: 0,
                                    notes: `Subscription Upgrade: ${tier.displayName} (Ref: ${data.tx_ref})`
                                }
                            });
                        }

                    } else {
                        // Handle Credit Purchase
                        // 1. Get or create credit account
                        let creditAccount = await prisma.credit.findFirst({
                            where: { organizationId }
                        });

                        if (!creditAccount) {
                            creditAccount = await prisma.credit.create({
                                data: {
                                    organizationId,
                                    amount: 0,
                                    type: 'PURCHASE',
                                    description: 'Organization Credit Account'
                                }
                            });
                        }

                        // 2. Update balance
                        await prisma.credit.update({
                            where: { id: creditAccount.id },
                            data: {
                                amount: { increment: Number(credits) }
                            }
                        });

                        // 3. Create transaction record
                        await prisma.creditTransaction.create({
                            data: {
                                creditId: creditAccount.id,
                                userId: userId,
                                type: 'PURCHASE',
                                creditsChange: Number(credits),
                                notes: `Flutterwave Payment: ${amount} ${currency} (Ref: ${data.tx_ref})`
                            }
                        });
                    }

                    console.log(`Payment processed successfully for org ${organizationId}`);
                } else {
                    console.log(`Transaction ${data.tx_ref} already processed.`);
                }
            }
        } else if (event === 'transfer.failed' || (event === 'charge.completed' && data.status === 'failed')) {
            // Handle payment failure
            console.log('Payment failed:', data);
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Flutterwave webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
