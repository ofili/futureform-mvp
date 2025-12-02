const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function loadTrustOntology() {
    console.log('🌱 Seeding Trust Intelligence Layer (JS Version)...\n');

    const ontologyPath = path.join(__dirname, '../ontology_data');
    console.log(`Looking for ontology data at: ${ontologyPath}\n`);

    if (!fs.existsSync(ontologyPath)) {
        throw new Error(`Ontology data directory not found at: ${ontologyPath}`);
    }

    // 1. Load and seed trust layers
    console.log('📊 Loading trust layers...');
    const layerFiles = [
        'layers_L1_Reliability.json',
        'layers_L2_Transparency.json',
        'layers_L3_Governance.json',
        'layers_L4_Competence.json',
        'layers_L5_Integrity.json',
        'layers_L6_Ecosystem.json',
    ];

    const masterWeightsPath = path.join(ontologyPath, 'master_layer_weights.json');
    if (!fs.existsSync(masterWeightsPath)) {
        throw new Error(`Master weights file not found at: ${masterWeightsPath}`);
    }
    const masterWeights = JSON.parse(fs.readFileSync(masterWeightsPath, 'utf-8'));

    for (const layerFile of layerFiles) {
        const layerPath = path.join(ontologyPath, layerFile);
        if (!fs.existsSync(layerPath)) {
            console.warn(`⚠️ Layer file not found: ${layerFile}, skipping...`);
            continue;
        }
        const layerData = JSON.parse(fs.readFileSync(layerPath, 'utf-8'));

        console.log(`  ✓ Processing ${layerData.layer_name}...`);

        try {
            // Create trust layer
            const layer = await prisma.trustLayer.upsert({
                where: { layerId: layerData.layer_id },
                update: {
                    name: layerData.layer_name,
                    totalQuestions: layerData.total_questions,
                    baselineWeight: masterWeights.baseline_weights[`${layerData.layer_id}_${layerData.layer_name}`] || 0.15,
                },
                create: {
                    layerId: layerData.layer_id,
                    name: layerData.layer_name,
                    totalQuestions: layerData.total_questions,
                    baselineWeight: masterWeights.baseline_weights[`${layerData.layer_id}_${layerData.layer_name}`] || 0.15,
                },
            });
            console.log(`    - Layer ${layer.layerId} upserted (Internal ID: ${layer.id})`);

            if (!layerData.sub_dimensions || layerData.sub_dimensions.length === 0) {
                console.warn(`    ⚠️ No sub-dimensions found for layer ${layerData.layer_id}`);
            } else {
                console.log(`    - Found ${layerData.sub_dimensions.length} sub-dimensions`);
            }

            // Create sub-dimensions and questions
            for (const subDim of layerData.sub_dimensions) {
                console.log(`      - Processing sub-dimension ${subDim.id} (${subDim.name})`);
                const subDimension = await prisma.trustSubDimension.upsert({
                    where: { dimensionId: subDim.id },
                    update: {
                        name: subDim.name,
                        weight: subDim.weight,
                    },
                    create: {
                        dimensionId: subDim.id,
                        name: subDim.name,
                        weight: subDim.weight,
                        layerId: layer.id,
                    },
                });

                // Create questions
                for (const question of subDim.questions) {
                    await prisma.trustQuestion.upsert({
                        where: { questionId: question.q_id },
                        update: {
                            text: question.text,
                            stakeholderTypes: question.stakeholder_types,
                            evidenceRequired: question.evidence_required,
                            evidenceWeight: question.evidence_weight.toUpperCase(), // Convert to enum format
                            weightInLayer: 1.0 / layerData.total_questions,
                            scoringLogic: {},
                            redFlags: [],
                        },
                        create: {
                            questionId: question.q_id,
                            text: question.text,
                            subDimensionId: subDimension.id,
                            stakeholderTypes: question.stakeholder_types,
                            evidenceRequired: question.evidence_required,
                            evidenceWeight: question.evidence_weight.toUpperCase(), // Convert to enum format
                            weightInLayer: 1.0 / layerData.total_questions,
                            scoringLogic: {},
                            redFlags: [],
                        },
                    });
                }
            }
        } catch (err) {
            console.error(`  ❌ Failed to process layer ${layerData.layer_name}:`, err.message);
            console.error(JSON.stringify(err, null, 2));
        }
    }

    console.log('\n✅ Trust layers loaded successfully!\n');

    // 2. Seed Partner Types
    console.log('📊 Seeding Partner Types...');

    const partnerTypes = [
        {
            id: 'pt_tech_vendor',
            name: 'Technology Vendor',
            description: 'Software or hardware vendors providing core infrastructure or applications.',
            roles: [
                { id: 'role_cto', name: 'CTO', criticality: 'CRITICAL', description: 'Chief Technology Officer', assessmentFocus: 'Technical strategy and security' },
                { id: 'role_pm', name: 'Product Manager', criticality: 'HIGH', description: 'Product Manager for the solution', assessmentFocus: 'Product roadmap and features' },
                { id: 'role_sec', name: 'Security Lead', criticality: 'CRITICAL', description: 'Head of Information Security', assessmentFocus: 'Security controls and compliance' }
            ]
        },
        {
            id: 'pt_impl_partner',
            name: 'Implementation Partner',
            description: 'Service providers assisting with system integration and deployment.',
            roles: [
                { id: 'role_proj_mgr', name: 'Project Manager', criticality: 'HIGH', description: 'Project delivery lead', assessmentFocus: 'Project timeline and deliverables' },
                { id: 'role_arch', name: 'Solution Architect', criticality: 'CRITICAL', description: 'Technical design authority', assessmentFocus: 'System architecture and integration' },
                { id: 'role_dev_lead', name: 'Lead Developer', criticality: 'MEDIUM', description: 'Senior development lead', assessmentFocus: 'Code quality and implementation' }
            ]
        },
        {
            id: 'pt_data_provider',
            name: 'Data Provider',
            description: 'Entities providing external data feeds or datasets.',
            roles: [
                { id: 'role_dpo', name: 'Data Protection Officer', criticality: 'CRITICAL', description: 'Compliance oversight', assessmentFocus: 'Data privacy and GDPR' },
                { id: 'role_data_eng', name: 'Data Engineer', criticality: 'HIGH', description: 'Technical data lead', assessmentFocus: 'Data pipeline reliability' },
                { id: 'role_compliance', name: 'Compliance Officer', criticality: 'HIGH', description: 'Regulatory compliance', assessmentFocus: 'Legal and regulatory adherence' }
            ]
        }
    ];

    for (const pt of partnerTypes) {
        console.log(`  ✓ Processing Partner Type: ${pt.name}...`);

        const partnerType = await prisma.trustPartnerType.upsert({
            where: { id: pt.id },
            update: {
                name: pt.name,
                description: pt.description,
                layerWeights: {}, // Default empty weights
            },
            create: {
                id: pt.id,
                name: pt.name,
                description: pt.description,
                layerWeights: {}, // Default empty weights
            },
        });

        // Create Roles
        for (const role of pt.roles) {
            await prisma.trustRequiredRole.upsert({
                where: { id: role.id },
                update: {
                    name: role.name,
                    criticality: role.criticality,
                    partnerTypeId: partnerType.id,
                    assessmentFocus: role.assessmentFocus,
                    layerCoverage: [], // Default to empty array
                },
                create: {
                    id: role.id,
                    name: role.name,
                    criticality: role.criticality,
                    partnerTypeId: partnerType.id,
                    assessmentFocus: role.assessmentFocus,
                    layerCoverage: [], // Default to empty array
                },
            });
        }
    }
    console.log('✅ Partner Types seeded successfully!\n');

    // 3. Map Questions to Partner Types (Sample Mapping)
    console.log('📊 Mapping Questions to Partner Types...');

    // Get all questions
    const allQuestions = await prisma.trustQuestion.findMany();
    const techVendor = await prisma.trustPartnerType.findUnique({ where: { id: 'pt_tech_vendor' } });

    if (techVendor && allQuestions.length > 0) {
        // Map first 10 questions to Tech Vendor
        for (const question of allQuestions.slice(0, 10)) {
            await prisma.trustPartnerTypeQuestion.upsert({
                where: {
                    partnerTypeId_questionId: {
                        partnerTypeId: techVendor.id,
                        questionId: question.id
                    }
                },
                update: {},
                create: {
                    partnerTypeId: techVendor.id,
                    questionId: question.id
                }
            });
        }
        console.log(`  ✓ Mapped 10 questions to ${techVendor.name}`);
    }
    console.log('✅ Question Mappings seeded successfully!\n');


}

async function main() {
    try {
        await loadTrustOntology();
    } catch (error) {
        console.error('❌ Error seeding trust ontology:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error('FATAL ERROR:', e);
        process.exit(1);
    });
