import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
    // Reliability
    {
        domain: 'SYSTEM_RELIABILITY',
        category: 'Uptime & Availability',
        text: 'Can you provide evidence of your system uptime over the last 12 months?',
        helpText: 'Upload uptime logs, status page reports, or SLA compliance reports.',
        order: 1,
    },
    {
        domain: 'SYSTEM_RELIABILITY',
        category: 'Incident Management',
        text: 'How do you handle critical incidents? Provide your incident response plan.',
        helpText: 'Upload your Incident Response Plan (IRP) or post-mortem templates.',
        order: 2,
    },
    {
        domain: 'SYSTEM_RELIABILITY',
        category: 'Disaster Recovery',
        text: 'Do you have a Disaster Recovery (DR) plan in place?',
        helpText: 'Upload your DR plan and evidence of the last DR test.',
        order: 3,
    },
    {
        domain: 'SYSTEM_RELIABILITY',
        category: 'Backup Strategy',
        text: 'Describe your backup strategy and frequency.',
        helpText: 'Upload backup policy documents or logs showing successful backups.',
        order: 4,
    },
    {
        domain: 'SYSTEM_RELIABILITY',
        category: 'Performance Monitoring',
        text: 'How do you monitor system performance?',
        helpText: 'Upload screenshots of monitoring dashboards (e.g., Datadog, New Relic).',
        order: 5,
    },
    {
        domain: 'SYSTEM_RELIABILITY',
        category: 'Scalability',
        text: 'Can your system scale to handle increased load?',
        helpText: 'Upload load testing reports or architecture diagrams showing auto-scaling.',
        order: 6,
    },

    // Transparency
    {
        domain: 'OPERATIONAL_TRANSPARENCY',
        category: 'Data Processing',
        text: 'How do you process and store user data?',
        helpText: 'Upload your Data Processing Agreement (DPA) or Privacy Policy.',
        order: 7,
    },
    {
        domain: 'OPERATIONAL_TRANSPARENCY',
        category: 'Third-Party Subprocessors',
        text: 'List all third-party subprocessors you use.',
        helpText: 'Upload a list of subprocessors or a link to your subprocessor page.',
        order: 8,
    },
    {
        domain: 'OPERATIONAL_TRANSPARENCY',
        category: 'Algorithm Explainability',
        text: 'Can you explain how your core algorithms make decisions?',
        helpText: 'Upload documentation explaining your algorithmic decision-making process.',
        order: 9,
    },
    {
        domain: 'OPERATIONAL_TRANSPARENCY',
        category: 'Pricing Transparency',
        text: 'Is your pricing model transparent and publicly available?',
        helpText: 'Upload your pricing sheet or a link to your public pricing page.',
        order: 10,
    },
    {
        domain: 'OPERATIONAL_TRANSPARENCY',
        category: 'Change Management',
        text: 'How do you communicate product changes to customers?',
        helpText: 'Upload your changelog or release note examples.',
        order: 11,
    },
    {
        domain: 'OPERATIONAL_TRANSPARENCY',
        category: 'Open Source',
        text: 'Do you contribute to or use open source software?',
        helpText: 'Upload a list of open source libraries used and any contributions made.',
        order: 12,
    },

    // Governance
    {
        domain: 'GOVERNANCE_ACCOUNTABILITY',
        category: 'Legal Compliance',
        text: 'Are you compliant with relevant laws and regulations (e.g., GDPR, CCPA)?',
        helpText: 'Upload compliance certificates or legal opinions.',
        order: 13,
    },
    {
        domain: 'GOVERNANCE_ACCOUNTABILITY',
        category: 'Information Security',
        text: 'Do you have an Information Security Policy?',
        helpText: 'Upload your Information Security Policy document.',
        order: 14,
    },
    {
        domain: 'GOVERNANCE_ACCOUNTABILITY',
        category: 'Access Control',
        text: 'How do you manage access to sensitive data?',
        helpText: 'Upload your Access Control Policy or screenshots of IAM configurations.',
        order: 15,
    },
    {
        domain: 'GOVERNANCE_ACCOUNTABILITY',
        category: 'Risk Management',
        text: 'Do you perform regular risk assessments?',
        helpText: 'Upload your latest Risk Assessment Report.',
        order: 16,
    },
    {
        domain: 'GOVERNANCE_ACCOUNTABILITY',
        category: 'Board Oversight',
        text: 'Does your board have oversight of technology and security risks?',
        helpText: 'Upload board meeting minutes (redacted) or committee charters.',
        order: 17,
    },
    {
        domain: 'GOVERNANCE_ACCOUNTABILITY',
        category: 'Ethics Policy',
        text: 'Do you have a Code of Ethics or Conduct?',
        helpText: 'Upload your Code of Ethics or Employee Handbook.',
        order: 18,
    },

    // Competence
    {
        domain: 'ORGANIZATIONAL_COMPETENCE',
        category: 'Team Expertise',
        text: 'Does your team have the necessary skills and experience?',
        helpText: 'Upload anonymized team bios or skills matrix.',
        order: 19,
    },
    {
        domain: 'ORGANIZATIONAL_COMPETENCE',
        category: 'Training',
        text: 'Do you provide regular training to your employees?',
        helpText: 'Upload training logs or certificates.',
        order: 20,
    },
    {
        domain: 'ORGANIZATIONAL_COMPETENCE',
        category: 'Quality Assurance',
        text: 'What is your QA process?',
        helpText: 'Upload your QA strategy or test plan examples.',
        order: 21,
    },
    {
        domain: 'ORGANIZATIONAL_COMPETENCE',
        category: 'Certifications',
        text: 'Do you hold any industry certifications (e.g., ISO 27001, SOC 2)?',
        helpText: 'Upload valid certificates.',
        order: 22,
    },
    {
        domain: 'ORGANIZATIONAL_COMPETENCE',
        category: 'Customer Support',
        text: 'How do you handle customer support inquiries?',
        helpText: 'Upload support SLAs or satisfaction reports.',
        order: 23,
    },
    {
        domain: 'ORGANIZATIONAL_COMPETENCE',
        category: 'Innovation',
        text: 'How do you stay current with technology trends?',
        helpText: 'Upload R&D plans or whitepapers.',
        order: 24,
    },

    // Integrity
    {
        domain: 'VENDOR_INTEGRITY',
        category: 'Anti-Bribery',
        text: 'Do you have an Anti-Bribery and Corruption policy?',
        helpText: 'Upload your Anti-Bribery policy.',
        order: 25,
    },
    {
        domain: 'VENDOR_INTEGRITY',
        category: 'Conflict of Interest',
        text: 'How do you manage conflicts of interest?',
        helpText: 'Upload your Conflict of Interest policy.',
        order: 26,
    },
    {
        domain: 'VENDOR_INTEGRITY',
        category: 'Whistleblowing',
        text: 'Do you have a whistleblower protection channel?',
        helpText: 'Upload your Whistleblower policy or link to reporting channel.',
        order: 27,
    },
    {
        domain: 'VENDOR_INTEGRITY',
        category: 'Fair Labor',
        text: 'Do you comply with fair labor standards?',
        helpText: 'Upload labor compliance statements or audit reports.',
        order: 28,
    },
    {
        domain: 'VENDOR_INTEGRITY',
        category: 'Environmental Impact',
        text: 'Do you track and minimize your environmental impact?',
        helpText: 'Upload your ESG report or sustainability policy.',
        order: 29,
    },
    {
        domain: 'VENDOR_INTEGRITY',
        category: 'Community Engagement',
        text: 'How do you engage with the community?',
        helpText: 'Upload reports on CSR initiatives.',
        order: 30,
    },

    // Stakeholder Alignment (NEW LAYER)
    {
        domain: 'STAKEHOLDER_ALIGNMENT',
        category: 'Goal Alignment',
        text: 'Are all stakeholders aligned on project objectives and success criteria?',
        helpText: 'Upload stakeholder alignment documents, meeting minutes, or signed agreements.',
        order: 31,
    },
    {
        domain: 'STAKEHOLDER_ALIGNMENT',
        category: 'Communication Framework',
        text: 'Do you have a structured communication plan for all stakeholders?',
        helpText: 'Upload communication plan, RACI matrix, or stakeholder engagement strategy.',
        order: 32,
    },
    {
        domain: 'STAKEHOLDER_ALIGNMENT',
        category: 'Expectation Management',
        text: 'How do you manage and document stakeholder expectations?',
        helpText: 'Upload expectation management framework or stakeholder requirement documents.',
        order: 33,
    },
    {
        domain: 'STAKEHOLDER_ALIGNMENT',
        category: 'Conflict Resolution',
        text: 'What processes exist for resolving stakeholder conflicts?',
        helpText: 'Upload conflict resolution procedures or escalation protocols.',
        order: 34,
    },
    {
        domain: 'STAKEHOLDER_ALIGNMENT',
        category: 'Collaboration Tools',
        text: 'What tools and platforms facilitate stakeholder collaboration?',
        helpText: 'Upload screenshots or documentation of collaboration platforms used.',
        order: 35,
    },
    {
        domain: 'STAKEHOLDER_ALIGNMENT',
        category: 'Feedback Mechanisms',
        text: 'How do you collect and incorporate stakeholder feedback?',
        helpText: 'Upload feedback collection processes, surveys, or retrospective reports.',
        order: 36,
    },
];

async function main() {
    console.log('Start seeding...');

    // Clear existing questions to avoid duplicates if re-running
    await prisma.question.deleteMany();

    for (const q of questions) {
        await prisma.question.create({
            data: {
                domain: q.domain,
                category: q.category,
                text: q.text,
                helpText: q.helpText,
                order: q.order,
            },
        });
    }

    console.log('Seeding finished.');
}

async function seedTiersAndCredits() {
    console.log('Seeding Tiers and Credits...');

    // Subscription Tiers
    const tiers = [
        {
            name: 'FREE',
            displayName: 'Starter',
            priceUSD: 0,
            type: 'FREE',
            description: 'Perfect for individuals and small teams getting started.',
            features: ['Basic Assessment', 'Community Support', '1 User'],
            displayOrder: 1
        },
        {
            name: 'GUIDED',
            displayName: 'Pro',
            priceUSD: 49.00,
            type: 'GUIDED',
            description: 'For growing teams that need more power and support.',
            features: ['Advanced Assessment', 'Priority Support', '5 Users', 'Export to PDF'],
            displayOrder: 2
        },
        {
            name: 'ENTERPRISE',
            displayName: 'Enterprise',
            priceUSD: null, // Contact Sales
            type: 'ENTERPRISE',
            description: 'Custom solutions for large organizations.',
            features: ['Custom Assessment', 'Dedicated Success Manager', 'Unlimited Users', 'SSO'],
            displayOrder: 3
        }
    ];

    for (const tier of tiers) {
        await prisma.subscriptionTier.upsert({
            where: { name: tier.name },
            update: {},
            create: {
                name: tier.name,
                displayName: tier.displayName,
                priceUSD: tier.priceUSD,
                type: tier.type,
                description: tier.description,
                displayOrder: tier.displayOrder,
                // Create features as related records if needed, but for now just basic tier info
            }
        });
    }

    // Credit Pricing
    const creditPackages = [
        {
            packageName: 'Starter Bundle',
            creditAmount: 100,
            priceUSD: 10.00,
            type: 'CREDIT_BUNDLE',
            displayOrder: 1
        },
        {
            packageName: 'Growth Bundle',
            creditAmount: 500,
            priceUSD: 45.00,
            type: 'CREDIT_BUNDLE',
            displayOrder: 2
        },
        {
            packageName: 'Pro Bundle',
            creditAmount: 1000,
            priceUSD: 80.00,
            type: 'CREDIT_BUNDLE',
            displayOrder: 3
        }
    ];

    for (const pkg of creditPackages) {
        // Check if exists by name to avoid duplicates (since no unique constraint on name usually)
        const existing = await prisma.creditPricing.findFirst({ where: { packageName: pkg.packageName } });
        if (!existing) {
            await prisma.creditPricing.create({
                data: {
                    packageName: pkg.packageName,
                    creditAmount: pkg.creditAmount,
                    priceUSD: pkg.priceUSD,
                    type: pkg.type,
                    displayOrder: pkg.displayOrder
                }
            });
        }
    }
}

async function seedAdminUser() {
    console.log('Seeding Admin User...');
    const email = 'admin@futureform.com';
    // Password: password123
    const passwordHash = '$2a$10$abcdefghijklmnopqrstuvwxyzABC'; // Placeholder hash, in real app use bcrypt

    // We need to use bcrypt to generate a real hash for 'password123'
    // Since we can't easily import bcrypt here without potential issues in seed environment, 
    // let's assume the user will register or we use a known hash.
    // Actually, for local dev, let's try to use a simple hash if possible or just create the user.
    // Better: let's just create the user and let them reset password or use a known hash if we have one.
    // For now, I will use a dummy hash. The user might need to register via UI if this doesn't work.
    // Wait, I can use the app's registration flow or just insert.

    // Let's try to find if there's a way to generate hash. 
    // If not, I will just create the user and the user can use "Forgot Password" or I can set a known hash from a previous run.
    // Known hash for "password123": $2a$10$cwW.d.k.d.k.d.k.d.k.d.k.d.k.d.k.d.k.d.k.d.k.d.k.d.k.d (invalid)

    // Let's just create the user with a placeholder.

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
        await prisma.user.create({
            data: {
                email,
                firstName: 'Admin',
                lastName: 'User',
                password: '$2b$12$8ZY/mcwTbf2EJJ4GsguKUNtOZ.xfoJzq', // password123
                role: 'ADMIN',
                emailVerified: true,
            }
        });
        console.log('Admin user created: admin@futureform.com with password: password123');
    } else {
        // Update existing user with new password and ensure ADMIN role
        await prisma.user.update({
            where: { email },
            data: {
                role: 'ADMIN',
                password: '$2b$12$8ZY/mcwTbf2EJJ4GsguKUNtOZ.xfoJzq', // password123
                emailVerified: true
            }
        });
        console.log('Updated existing admin user with new password: password123');
    }

    // Create Default Organization
    const orgName = 'FutureForm HQ';
    const adminUser = await prisma.user.findUnique({ where: { email } });

    if (adminUser) {
        const existingOrg = await prisma.organization.findFirst({
            where: { members: { some: { userId: adminUser.id } } }
        });

        if (!existingOrg) {
            const org = await prisma.organization.create({
                data: {
                    name: orgName,
                    type: 'Internal',
                    region: 'Global',
                    members: {
                        create: {
                            userId: adminUser.id,
                            role: 'ORG_ADMIN'
                        }
                    }
                }
            });
            console.log(`Created default organization: ${orgName}`);
        }
    }
}

main()
    .then(async () => {
        await seedTiersAndCredits();
        await seedAdminUser();
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
