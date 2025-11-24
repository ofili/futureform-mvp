import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check role: Only CREDIT_MANAGER, ADMIN (Org or Global), or OWNER can purchase
        const isGlobalAdmin = session.user.role === 'ADMIN';
        const allowedOrgRoles = ['CREDIT_MANAGER', 'ADMIN', 'OWNER'];
        const isAllowedOrgRole = allowedOrgRoles.includes(session.user.organizationRole || '');

        if (!isGlobalAdmin && !isAllowedOrgRole) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { credits, tierId } = await request.json();
        const organizationId = session.user.organizationId;

        // 2. Generate Flutterwave Payment Link
        const tx_ref = `tx-${organizationId}-${Date.now()}`;
        
        let amount = 0;
        let currency = 'USD';
        let paymentTitle = '';
        let metaData: any = {
            userId: session.user.id,
            organizationId,
        };

        if (tierId) {
            // Handle Subscription Upgrade
            const tier = await prisma.subscriptionTier.findUnique({
                where: { id: tierId }
            });

            if (!tier) {
                return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
            }

            if (!tier.priceUSD) {
                 return NextResponse.json({ error: 'This tier requires contacting sales' }, { status: 400 });
            }

            amount = Number(tier.priceUSD);
            paymentTitle = `Upgrade to ${tier.displayName}`;
            metaData.tierId = tierId;
            metaData.type = 'SUBSCRIPTION_UPGRADE';

        } else if (credits) {
            // Handle Credit Purchase
            const packageOption = await prisma.creditPricing.findFirst({
                where: { creditAmount: credits, type: 'RESPONDENT_BUNDLE', isActive: true }
            });

            if (!packageOption) {
                 return NextResponse.json({ error: 'Invalid credit package' }, { status: 400 });
            }

            amount = Number(packageOption.priceUSD);
            paymentTitle = `FutureForm Credits (${credits})`;
            metaData.credits = credits;
            metaData.packageId = packageOption.id;
            metaData.type = 'CREDIT_PURCHASE';
        } else {
            return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
        }

        const flwPayload = {
            tx_ref,
            amount,
            currency,
            redirect_url: `${process.env.NEXTAUTH_URL}/dashboard/credits?success=true`,
            customer: {
                email: session.user.email,
                name: session.user.name || 'FutureForm User',
            },
            customizations: {
                title: paymentTitle,
                logo: 'https://futureform.africa/logo.png' // Replace with actual logo URL
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
            console.error('Flutterwave error:', flwData);
            return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            url: flwData.data.link,
            message: 'Redirecting to payment gateway'
        });

    } catch (error) {
        console.error('Error processing checkout:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
