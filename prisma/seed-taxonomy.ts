import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed Trust Intelligence Platform Taxonomy
 * Based on project-assessment-feature.md
 */
export async function seedTrustTaxonomy() {
    console.log('🌱 Seeding Trust Intelligence Taxonomy...');

    // ========================================
    // PROJECT TYPES
    // ========================================
    const projectTypes = [
        {
            label: 'Technology Deployment Projects',
            value: 'TECHNOLOGY_DEPLOYMENT',
            children: [
                'Core system implementation (ERP, CRM, HRIS, EMR, Billing, etc.)',
                'Cloud migration / infrastructure modernization',
                'Data center deployment',
                'IoT / smart infrastructure rollout',
                'AI/ML deployment',
                'Cybersecurity upgrade or overhaul',
                'Digital identity / authentication systems',
                'Payment infrastructure deployments',
                'Telecom or connectivity expansion',
            ],
        },
        {
            label: 'Infrastructure & Capital Projects',
            value: 'INFRASTRUCTURE_CAPITAL',
            children: [
                'Transport infrastructure (roads, rail, ports, aviation)',
                'Power infrastructure (grid, solar, minigrid, energy-as-a-service)',
                'Water, sanitation, and waste systems',
                'Smart city systems',
                'Large public-private partnership (PPP) projects',
                'Digital public infrastructure (DPI)',
            ],
        },
        {
            label: 'Governance, Policy, and Institutional Strengthening Projects',
            value: 'GOVERNANCE_POLICY',
            children: [
                'Government technology reform',
                'Civil service modernization',
                'Procurement reform',
                'Regulatory compliance programs',
                'Transparency & accountability initiatives',
            ],
        },
        {
            label: 'Social, Health, and Impact Projects',
            value: 'SOCIAL_HEALTH_IMPACT',
            children: [
                'Healthcare system digitization',
                'Education technology adoption',
                'Agriculture value-chain systems',
                'Social protection programs (cash transfer, registration systems)',
                'NGO/CSO program evaluations',
            ],
        },
        {
            label: 'Private Sector & Enterprise Projects',
            value: 'PRIVATE_SECTOR_ENTERPRISE',
            children: [
                'Vendor onboarding',
                'Supplier reliability assessment',
                'M&A due diligence',
                'Strategic partnership evaluation',
                'Enterprise risk transformation initiative',
            ],
        },
    ];

    for (const projectType of projectTypes) {
        const parent = await prisma.formOption.upsert({
            where: { category_value: { category: 'PROJECT_TYPE', value: projectType.value } },
            update: {},
            create: {
                category: 'PROJECT_TYPE',
                value: projectType.value,
                label: projectType.label,
                displayOrder: projectTypes.indexOf(projectType),
                isActive: true,
            },
        });

        // Create children
        for (const childLabel of projectType.children) {
            const childValue = childLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
            await prisma.formOption.upsert({
                where: { category_value: { category: 'PROJECT_TYPE_SUB', value: childValue } },
                update: {},
                create: {
                    category: 'PROJECT_TYPE_SUB',
                    value: childValue,
                    label: childLabel,
                    parentId: parent.id,
                    displayOrder: projectType.children.indexOf(childLabel),
                    isActive: true,
                },
            });
        }
    }

    // ========================================
    // ASSESSMENT TYPES
    // ========================================
    const assessmentTypes = [
        {
            label: 'Partner Due Diligence Assessments',
            value: 'PARTNER_DUE_DILIGENCE',
            children: [
                'Vendor integrity assessment',
                'Supplier reliability assessment',
                'Delivery competence assessment',
                'Conflict of interest & alignment checks',
                'ESG trust & integrity evaluation',
            ],
        },
        {
            label: 'Technology/System Assessments',
            value: 'TECHNOLOGY_SYSTEM',
            children: [
                'System reliability assessment',
                'Cybersecurity trust assessment',
                'Operational transparency assessment',
                'AI governance & risk assessment',
                'Data governance assessment',
            ],
        },
        {
            label: 'Organizational Capability Assessments',
            value: 'ORGANIZATIONAL_CAPABILITY',
            children: [
                'Digital readiness',
                'Skill & competency mapping',
                'Operational resilience',
                'Process maturity',
                'Governance maturity',
            ],
        },
        {
            label: 'Project/Program Trust Risk Assessments',
            value: 'PROJECT_RISK',
            children: [
                'Pre-investment trust assessment',
                'Mid-project performance trust review',
                'Post-implementation trust audit',
                'Multi-stakeholder alignment assessment',
                'Red-flag and early-warning assessment',
            ],
        },
        {
            label: 'Government/DFI Mandatory Assessments',
            value: 'REGULATORY_COMPLIANCE',
            children: [
                'Fiduciary trust assessment',
                'Safeguards compliance',
                'Procurement trust and conflict checks',
                'Beneficiary trust impact analysis',
            ],
        },
    ];

    for (const assessmentType of assessmentTypes) {
        const parent = await prisma.formOption.upsert({
            where: { category_value: { category: 'ASSESSMENT_TYPE', value: assessmentType.value } },
            update: {},
            create: {
                category: 'ASSESSMENT_TYPE',
                value: assessmentType.value,
                label: assessmentType.label,
                displayOrder: assessmentTypes.indexOf(assessmentType),
                isActive: true,
            },
        });

        // Create children
        for (const childLabel of assessmentType.children) {
            const childValue = childLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
            await prisma.formOption.upsert({
                where: { category_value: { category: 'ASSESSMENT_TYPE_SUB', value: childValue } },
                update: {},
                create: {
                    category: 'ASSESSMENT_TYPE_SUB',
                    value: childValue,
                    label: childLabel,
                    parentId: parent.id,
                    displayOrder: assessmentType.children.indexOf(childLabel),
                    isActive: true,
                },
            });
        }
    }

    // ========================================
    // PARTNER TYPES
    // ========================================
    const partnerTypes = [
        { label: 'Technology Partners', value: 'TECHNOLOGY_PARTNER' },
        { label: 'Implementation Partners', value: 'IMPLEMENTATION_PARTNER' },
        { label: 'Infrastructure & Engineering Partners', value: 'INFRASTRUCTURE_ENGINEERING' },
        { label: 'Professional Services Partners', value: 'PROFESSIONAL_SERVICES' },
        { label: 'Delivery Partners / On-the-Ground Actors', value: 'DELIVERY_PARTNER' },
        { label: 'Government or State Agencies', value: 'GOVERNMENT_AGENCY' },
        { label: 'Financial & Funding Partners', value: 'FINANCIAL_PARTNER' },
        { label: 'Consortium or Multi-party Partners', value: 'CONSORTIUM_PARTNER' },
    ];

    for (const partnerType of partnerTypes) {
        await prisma.formOption.upsert({
            where: { category_value: { category: 'PARTNER_TYPE', value: partnerType.value } },
            update: {},
            create: {
                category: 'PARTNER_TYPE',
                value: partnerType.value,
                label: partnerType.label,
                displayOrder: partnerTypes.indexOf(partnerType),
                isActive: true,
            },
        });
    }

    console.log('✅ Trust Intelligence Taxonomy seeded successfully');
}

// Run if executed directly
seedTrustTaxonomy()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
