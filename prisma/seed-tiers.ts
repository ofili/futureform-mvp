import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tiers = [
        {
            name: 'Framework Access',
            type: 'Framework Access',
            price: 0,
            credits: 0,
            features: [
                'Complete question bank',
                'Scoring methodology',
                'Implementation guide'
            ]
        },
        {
            name: 'Guided Assessment',
            type: 'Guided Assessment',
            price: 3500,
            credits: 1,
            features: [
                'Partner assessment portal',
                'Automated validation',
                'Trust profile report',
                'Risk recommendations',
                '30-day support'
            ]
        },
        {
            name: 'Enterprise Program',
            type: 'Enterprise Program',
            price: 0, // Custom
            credits: 0, // Unlimited/Custom
            features: [
                'Unlimited assessments',
                'Custom question sets',
                'Comparative analytics',
                'API integration',
                'Dedicated success manager'
            ]
        }
    ];

    for (const tier of tiers) {
        const createdTier = await prisma.subscriptionTier.upsert({
            where: { name: tier.name },
            update: {
                displayName: tier.name, // Assuming name is display name for now
                priceUSD: tier.price,
                creditsIncluded: tier.credits,
                // features are handled separately or need nested write if supported and desired
            },
            create: {
                name: tier.name,
                displayName: tier.name,
                priceUSD: tier.price,
                creditsIncluded: tier.credits,
            }
        });

        // Handle features
        // First delete existing features for this tier to avoid duplicates/stale data
        await prisma.tierFeature.deleteMany({
            where: { tierId: createdTier.id }
        });

        // Create new features
        if (tier.features && tier.features.length > 0) {
            await prisma.tierFeature.createMany({
                data: tier.features.map(f => ({
                    tierId: createdTier.id,
                    feature: f
                }))
            });
        }
    }

    console.log('Subscription tiers seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
