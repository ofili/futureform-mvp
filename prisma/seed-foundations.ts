import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Foundations admin data...');

    // Seed Subscription Tiers
    const tiers = [
        {
            name: 'framework_access',
            displayName: 'Framework Access',
            priceUSD: null,
            pricePeriod: null,
            creditsIncluded: 0,
            bestFor: 'DIY capacity building',
            description: 'Access to the 30-question framework and self-assessment tools',
            isActive: true,
            displayOrder: 1,
            features: [
                '30-question framework',
                'Scoring methodology',
                'Evidence templates',
                'Self-assessment guide'
            ]
        },
        {
            name: 'guided_assessment',
            displayName: 'Guided Assessment',
            priceUSD: 3500,
            pricePeriod: 'per assessment',
            creditsIncluded: 1,
            bestFor: 'Single partner vetting',
            description: 'Platform access with AI-assisted validation and Trust Profile™ report',
            isActive: true,
            displayOrder: 2,
            features: [
                'Platform access',
                'AI-assisted validation',
                'Trust Profile™ report',
                'Comparative benchmarking',
                '90-day report access',
                'Email support'
            ]
        },
        {
            name: 'enterprise_program',
            displayName: 'Enterprise Program',
            priceUSD: 25000,
            pricePeriod: 'annual program',
            creditsIncluded: 0,
            bestFor: 'Portfolio monitoring',
            description: 'Unlimited assessments with portfolio dashboard and dedicated support',
            isActive: true,
            displayOrder: 3,
            features: [
                'Unlimited assessments',
                'Portfolio dashboard',
                'API integration',
                'White-label options',
                'Dedicated support',
                'Quarterly reviews'
            ]
        }
    ];

    for (const tierData of tiers) {
        const { features, ...tierInfo } = tierData;

        const tier = await prisma.subscriptionTier.upsert({
            where: { name: tierData.name },
            update: tierInfo,
            create: tierInfo
        });

        // Create tier features
        for (let i = 0; i < features.length; i++) {
            const existingFeature = await prisma.tierFeature.findFirst({
                where: {
                    tierId: tier.id,
                    feature: features[i]
                }
            });

            if (existingFeature) {
                await prisma.tierFeature.update({
                    where: { id: existingFeature.id },
                    data: { displayOrder: i }
                });
            } else {
                await prisma.tierFeature.create({
                    data: {
                        tierId: tier.id,
                        feature: features[i],
                        displayOrder: i
                    }
                });
            }
        }

        console.log(`✓ Seeded tier: ${tier.displayName}`);
    }

    // Seed Form Options
    const formOptions = [
        // Sectors
        { category: 'sector', value: 'infrastructure', label: 'Infrastructure', displayOrder: 1 },
        { category: 'sector', value: 'digital_transformation', label: 'Digital Transformation', displayOrder: 2 },
        { category: 'sector', value: 'health', label: 'Health', displayOrder: 3 },
        { category: 'sector', value: 'education', label: 'Education', displayOrder: 4 },
        { category: 'sector', value: 'agriculture', label: 'Agriculture', displayOrder: 5 },
        { category: 'sector', value: 'financial_services', label: 'Financial Services', displayOrder: 6 },
        { category: 'sector', value: 'climate', label: 'Climate', displayOrder: 7 },
        { category: 'sector', value: 'governance', label: 'Governance', displayOrder: 8 },

        // Regions
        { category: 'region', value: 'sub_saharan_africa', label: 'Sub-Saharan Africa', displayOrder: 1 },
        { category: 'region', value: 'mena', label: 'MENA', displayOrder: 2 },
        { category: 'region', value: 'south_asia', label: 'South Asia', displayOrder: 3 },
        { category: 'region', value: 'east_asia_pacific', label: 'East Asia & Pacific', displayOrder: 4 },
        { category: 'region', value: 'latin_america', label: 'Latin America', displayOrder: 5 },
        { category: 'region', value: 'eastern_europe_central_asia', label: 'Eastern Europe & Central Asia', displayOrder: 6 },

        // Departments
        { category: 'department', value: 'executive', label: 'Executive', displayOrder: 1 },
        { category: 'department', value: 'operations', label: 'Operations', displayOrder: 2 },
        { category: 'department', value: 'technology', label: 'Technology', displayOrder: 3 },
        { category: 'department', value: 'finance', label: 'Finance', displayOrder: 4 },
        { category: 'department', value: 'program_project', label: 'Program/Project', displayOrder: 5 },
        { category: 'department', value: 'external_affairs', label: 'External Affairs', displayOrder: 6 },
        { category: 'department', value: 'other', label: 'Other', displayOrder: 7 },

        // Relationship Stages
        { category: 'relationship_stage', value: 'lead', label: 'Lead', displayOrder: 1 },
        { category: 'relationship_stage', value: 'contacted', label: 'Contacted', displayOrder: 2 },
        { category: 'relationship_stage', value: 'discovery', label: 'Discovery', displayOrder: 3 },
        { category: 'relationship_stage', value: 'pilot', label: 'Pilot', displayOrder: 4 },
        { category: 'relationship_stage', value: 'active_client', label: 'Active Client', displayOrder: 5 },
        { category: 'relationship_stage', value: 'churned', label: 'Churned', displayOrder: 6 },

        // Sources
        { category: 'source', value: 'referral', label: 'Referral', displayOrder: 1 },
        { category: 'source', value: 'inbound', label: 'Inbound', displayOrder: 2 },
        { category: 'source', value: 'outbound', label: 'Outbound', displayOrder: 3 },
        { category: 'source', value: 'conference', label: 'Conference', displayOrder: 4 },
        { category: 'source', value: 'partnership', label: 'Partnership', displayOrder: 5 },
    ];

    for (const option of formOptions) {
        await prisma.formOption.upsert({
            where: {
                category_value: {
                    category: option.category,
                    value: option.value
                }
            },
            update: option,
            create: option
        });
    }

    console.log(`✓ Seeded ${formOptions.length} form options`);

    // Seed Credit Pricing
    const creditPackages = [
        {
            packageName: 'Single Assessment',
            creditAmount: 1,
            priceUSD: 3500,
            isActive: true,
            displayOrder: 1
        },
        {
            packageName: '5 Assessments',
            creditAmount: 5,
            priceUSD: 16000,
            isActive: true,
            displayOrder: 2
        },
        {
            packageName: '10 Assessments',
            creditAmount: 10,
            priceUSD: 30000,
            isActive: true,
            displayOrder: 3
        }
    ];

    for (const pkg of creditPackages) {
        const existing = await prisma.creditPricing.findFirst({
            where: { packageName: pkg.packageName }
        });

        if (existing) {
            await prisma.creditPricing.update({
                where: { id: existing.id },
                data: pkg
            });
        } else {
            await prisma.creditPricing.create({
                data: pkg
            });
        }
    }

    console.log(`✓ Seeded ${creditPackages.length} credit packages`);

    console.log('✅ Foundations admin data seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
