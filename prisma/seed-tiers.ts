import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding subscription tiers...');

    // 1. Define Tiers
    const tiers = [
        {
            name: 'Free',
            displayName: 'Free',
            type: 'FREE',
            priceUSD: 0,
            baseFeeUSD: 0,
            creditsIncluded: 0,
            minRespondents: 1,
            description: 'For internal use and trial',
            features: [
                'Up to 30 questions',
                'Single-user internal use',
                'Basic reporting',
                'No partner invites'
            ],
            bands: []
        },
        {
            name: 'Guided',
            displayName: 'Guided',
            type: 'GUIDED',
            priceUSD: 0, // Pay per respondent
            baseFeeUSD: 0,
            creditsIncluded: 0,
            minRespondents: 1,
            description: 'For SMB and Mid-market',
            features: [
                'Partner assessment portal',
                'Automated validation',
                'Trust profile report',
                'Risk recommendations',
                '1 analyst review per 10 respondents'
            ],
            bands: [
                { minCount: 1, maxCount: 10, pricePerUnit: 400 },
                { minCount: 11, maxCount: 50, pricePerUnit: 250 },
                { minCount: 51, maxCount: 200, pricePerUnit: 150 },
                { minCount: 201, maxCount: null, pricePerUnit: 150 } // Fallback/Cap
            ]
        },
        {
            name: 'Enterprise',
            displayName: 'Enterprise',
            type: 'ENTERPRISE',
            priceUSD: 0,
            baseFeeUSD: 40000,
            creditsIncluded: 100,
            minRespondents: 100,
            description: 'For large organizations requiring scale and support',
            features: [
                'Unlimited assessments',
                'SSO & White-labeling',
                'API Access',
                'Priority support',
                'Dedicated success manager'
            ],
            bands: [
                { minCount: 1, maxCount: 100, pricePerUnit: 100 },
                { minCount: 101, maxCount: 500, pricePerUnit: 75 },
                { minCount: 501, maxCount: null, pricePerUnit: 50 }
            ]
        }
    ];

    for (const tier of tiers) {
        // Upsert Tier
        const createdTier = await prisma.subscriptionTier.upsert({
            where: { name: tier.name },
            update: {
                displayName: tier.displayName,
                type: tier.type,
                priceUSD: tier.priceUSD,
                baseFeeUSD: tier.baseFeeUSD,
                creditsIncluded: tier.creditsIncluded,
                minRespondents: tier.minRespondents,
                description: tier.description,
            },
            create: {
                name: tier.name,
                displayName: tier.displayName,
                type: tier.type,
                priceUSD: tier.priceUSD,
                baseFeeUSD: tier.baseFeeUSD,
                creditsIncluded: tier.creditsIncluded,
                minRespondents: tier.minRespondents,
                description: tier.description,
            }
        });

        console.log(`Upserted tier: ${tier.name}`);

        // Update Features
        await prisma.tierFeature.deleteMany({ where: { tierId: createdTier.id } });
        if (tier.features.length > 0) {
            await prisma.tierFeature.createMany({
                data: tier.features.map((f, i) => ({
                    tierId: createdTier.id,
                    feature: f,
                    displayOrder: i
                }))
            });
        }

        // Update Bands
        await prisma.creditBand.deleteMany({ where: { tierId: createdTier.id } });
        if (tier.bands.length > 0) {
            await prisma.creditBand.createMany({
                data: tier.bands.map(b => ({
                    tierId: createdTier.id,
                    minCount: b.minCount,
                    maxCount: b.maxCount,
                    pricePerUnit: b.pricePerUnit,
                    currency: 'USD'
                }))
            });
        }
    }

    console.log('Seeding credit packages...');

    // 2. Define Credit Packages (Assessment Packs / Bundles)
    const creditPackages = [
        {
            packageName: 'Small Project Pack',
            type: 'RC_ONLY' as const,
            creditAmount: 10,
            priceUSD: 3500,
            displayOrder: 1,
            isActive: true
        },
        {
            packageName: 'Standard Project Pack',
            type: 'RC_ONLY' as const,
            creditAmount: 25,
            priceUSD: 6250,
            displayOrder: 2,
            isActive: true
        },
        {
            packageName: 'Organizational Pack',
            type: 'RC_ONLY' as const,
            creditAmount: 50,
            priceUSD: 11250,
            displayOrder: 3,
            isActive: true
        },
        {
            packageName: 'High-Volume Pack',
            type: 'RC_ONLY' as const,
            creditAmount: 100,
            priceUSD: 17500,
            displayOrder: 4,
            isActive: true
        }
    ];

    // Clear existing credit pricing to avoid duplicates if names changed, or just upsert?
    // Since we don't have unique name constraint on CreditPricing in schema (checked earlier, it has id), 
    // but usually we want to reset. Let's delete all and recreate for clean seed.
    await prisma.creditPricing.deleteMany({});

    await prisma.creditPricing.createMany({
        data: creditPackages
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
