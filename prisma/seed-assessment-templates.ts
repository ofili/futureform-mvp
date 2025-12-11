/**
 * Seed Assessment Templates
 * Maps templates to TrustPartnerType for question retrieval
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const assessmentTemplates = [
    {
        value: 'technology_vendor_assessment',
        label: 'Technology Vendor Assessment',
        description: 'Comprehensive evaluation of technology and software vendors',
        partnerTypeMapping: 'TECHNOLOGY_VENDOR',
        displayOrder: 1,
    },
    {
        value: 'supplier_due_diligence',
        label: 'Supplier Due Diligence',
        description: 'Verify supplier capabilities, compliance and reliability',
        partnerTypeMapping: 'SUPPLIER',
        displayOrder: 2,
    },
    {
        value: 'partner_evaluation',
        label: 'Partner Evaluation',
        description: 'Assess potential partnership value and alignment',
        partnerTypeMapping: 'STRATEGIC_PARTNER',
        displayOrder: 3,
    },
    {
        value: 'contractor_vetting',
        label: 'Contractor Vetting',
        description: 'Screen contractors before engagement',
        partnerTypeMapping: 'IMPLEMENTATION_CONTRACTOR',
        displayOrder: 4,
    },
    {
        value: 'investment_target_screening',
        label: 'Investment Target Screening',
        description: 'Pre-investment due diligence and risk assessment',
        partnerTypeMapping: 'INVESTMENT_TARGET',
        displayOrder: 5,
    },
];

async function seedAssessmentTemplates() {
    console.log('🌱 Seeding Assessment Templates...\n');

    for (const template of assessmentTemplates) {
        // Find or create TrustPartnerType for this template
        let partnerType = await prisma.trustPartnerType.findFirst({
            where: { name: { contains: template.partnerTypeMapping, mode: 'insensitive' } }
        });

        // If no matching partner type, create one
        if (!partnerType) {
            partnerType = await prisma.trustPartnerType.create({
                data: {
                    name: template.label,
                    description: template.description,
                    layerWeights: {
                        L1: 0.20, // Reliability
                        L2: 0.15, // Transparency
                        L3: 0.20, // Governance
                        L4: 0.20, // Competence
                        L5: 0.15, // Integrity
                        L6: 0.10, // Ecosystem
                    },
                },
            });
            console.log(`  ✅ Created TrustPartnerType: ${partnerType.name}`);
        }

        // Create FormOption for the template
        await prisma.formOption.upsert({
            where: {
                category_value: {
                    category: 'assessment_template',
                    value: template.value,
                },
            },
            update: {
                label: template.label,
                displayOrder: template.displayOrder,
                isActive: true,
            },
            create: {
                category: 'assessment_template',
                value: template.value,
                label: template.label,
                displayOrder: template.displayOrder,
                isActive: true,
            },
        });
        console.log(`  ✅ Upserted FormOption: ${template.label}`);

        // Link questions to partner type if not already linked
        // Get all trust questions
        const questions = await prisma.trustQuestion.findMany();
        const existingLinks = await prisma.trustPartnerTypeQuestion.findMany({
            where: { partnerTypeId: partnerType.id },
        });

        if (existingLinks.length === 0 && questions.length > 0) {
            // Link all questions to this partner type (can be refined later)
            for (const question of questions) {
                await prisma.trustPartnerTypeQuestion.create({
                    data: {
                        partnerTypeId: partnerType.id,
                        questionId: question.id,
                        isRequired: true,
                    },
                });
            }
            console.log(`  📝 Linked ${questions.length} questions to ${partnerType.name}`);
        }
    }

    console.log('\n✅ Assessment Templates seeded successfully!');
}

seedAssessmentTemplates()
    .catch((e) => {
        console.error('Error seeding assessment templates:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
