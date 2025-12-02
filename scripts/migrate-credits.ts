import { PrismaClient, PackageType, EvidenceLayer } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting credit system migration...');

    // 1. Initialize Credits for Organizations
    const organizations = await prisma.organization.findMany({
        include: {
            respondentCredits: true,
            evidenceCredits: true,
        },
    });

    console.log(`Found ${organizations.length} organizations.`);

    for (const org of organizations) {
        // Initialize Respondent Credits (check array length)
        if (!org.respondentCredits || org.respondentCredits.length === 0) {
            console.log(`Initializing RC for org ${org.id}...`);
            await prisma.respondentCredit.create({
                data: {
                    organizationId: org.id,
                    amount: 0,
                },
            });
        }

        // Initialize Evidence Credits (check array length)
        if (!org.evidenceCredits || org.evidenceCredits.length === 0) {
            console.log(`Initializing EC for org ${org.id}...`);
            await prisma.evidenceCredit.create({
                data: {
                    organizationId: org.id,
                    amount: 0,
                },
            });
        }
    }

    // 2. Seed Credit Packages
    console.log('Seeding credit packages...');
    const packages = [
        {
            name: 'Small Project Pack',
            description: 'Perfect for pilots and small team assessments',
            type: PackageType.RC_ONLY,
            creditAmount: 10,
            priceUSD: 3500,
            features: ['10 Respondent Credits', 'Basic Templates'],
        },
        {
            name: 'Standard Project Pack',
            description: 'The standard for departmental or unit assessments',
            type: PackageType.RC_ONLY,
            creditAmount: 25,
            priceUSD: 6250,
            features: ['25 Respondent Credits', 'Advanced Templates', 'Priority Support'],
        },
        {
            name: 'Organizational Pack',
            description: 'For comprehensive organizational diagnostics',
            type: PackageType.RC_ONLY,
            creditAmount: 50,
            priceUSD: 11250,
            features: ['50 Respondent Credits', 'Custom Questions', 'Success Manager'],
        },
        {
            name: 'High-Volume Pack',
            description: 'For large scale deployments',
            type: PackageType.RC_ONLY,
            creditAmount: 100,
            priceUSD: 17500,
            features: ['100 Respondent Credits', 'Volume Discount'],
        },
        {
            name: 'Starter Monitoring',
            description: 'Essential evidence collection',
            type: PackageType.EC_ONLY,
            creditAmount: 500,
            priceUSD: 500,
            features: ['500 Evidence Credits', 'AE & VE Access'],
        },
        {
            name: 'Pro Verification',
            description: 'Deep verification and continuous monitoring',
            type: PackageType.EC_ONLY,
            creditAmount: 3000,
            priceUSD: 2500,
            features: ['3000 Evidence Credits', 'All Layers Access', 'Analyst Reviews'],
        },
        {
            name: 'Enterprise Intelligence',
            description: 'High-volume signal processing',
            type: PackageType.EC_ONLY,
            creditAmount: 15000,
            priceUSD: 10000,
            features: ['15000 Evidence Credits', 'Custom Integrations', 'SLA'],
        },
    ];

    for (const pkg of packages) {
        const existing = await prisma.creditPackage.findFirst({
            where: { name: pkg.name },
        });

        if (!existing) {
            console.log(`Creating package: ${pkg.name}`);
            await prisma.creditPackage.create({
                data: pkg,
            });
        }
    }

    // 3. Seed EC Pricing
    console.log('Seeding EC pricing...');
    const pricing = [
        { layer: EvidenceLayer.AE, evidenceType: 'Standard Response', costPerUnit: 0, description: 'Included with RC' },
        { layer: EvidenceLayer.AE, evidenceType: 'Document Upload', costPerUnit: 1, description: 'Per file' },
        { layer: EvidenceLayer.AE, evidenceType: 'Link Submission', costPerUnit: 0.5, description: 'Per URL' },
        { layer: EvidenceLayer.VE, evidenceType: 'Analyst Review', costPerUnit: 50, description: 'Per hour' },
        { layer: EvidenceLayer.VE, evidenceType: 'Identity Check', costPerUnit: 5, description: 'Per verification' },
        { layer: EvidenceLayer.VE, evidenceType: 'Company Check', costPerUnit: 10, description: 'Per verification' },
        { layer: EvidenceLayer.DSE, evidenceType: 'API Signal Check', costPerUnit: 0.1, description: 'Per call' },
        { layer: EvidenceLayer.DSE, evidenceType: 'Continuous Monitoring', costPerUnit: 10, description: 'Per asset/month' },
        { layer: EvidenceLayer.DSE, evidenceType: 'Log Analysis', costPerUnit: 5, description: 'Per GB' },
    ];

    for (const p of pricing) {
        const existing = await prisma.eCPricing.findFirst({
            where: { layer: p.layer, evidenceType: p.evidenceType },
        });

        if (!existing) {
            console.log(`Creating pricing: ${p.layer} - ${p.evidenceType}`);
            await prisma.eCPricing.create({
                data: p,
            });
        }
    }

    console.log('Migration completed successfully.');
}

main()
    .catch((e) => {
        console.error('Migration failed:');
        console.error(e);
        if (e.code) console.error('Error code:', e.code);
        if (e.meta) console.error('Error meta:', e.meta);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
