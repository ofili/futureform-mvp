import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface LayerData {
    layer_id: string;
    layer_name: string;
    total_questions: number;
    total_sub_dimensions: number;
    sub_dimensions: {
        id: string;
        name: string;
        weight: number;
        questions: {
            q_id: string;
            text: string;
            stakeholder_types: string[];
            evidence_required: string;
            evidence_weight: string;
        }[];
    }[];
}

interface MasterWeights {
    baseline_weights: Record<string, number>;
    context_adjustments: Record<string, any>;
}

async function loadTrustOntology() {
    console.log('🌱 Seeding Trust Intelligence Layer (Layers Only)...\n');

    // Use local ontology_data folder in frontend directory  
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
    const masterWeights: MasterWeights = JSON.parse(fs.readFileSync(masterWeightsPath, 'utf-8'));

    for (const layerFile of layerFiles) {
        const layerPath = path.join(ontologyPath, layerFile);
        if (!fs.existsSync(layerPath)) {
            console.warn(`⚠️ Layer file not found: ${layerFile}, skipping...`);
            continue;
        }
        const layerData: LayerData = JSON.parse(fs.readFileSync(layerPath, 'utf-8'));

        console.log(`  ✓ Processing ${layerData.layer_name}...`);

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

        // Create sub-dimensions and questions
        for (const subDim of layerData.sub_dimensions) {
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
                        evidenceWeight: question.evidence_weight as any,
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
                        evidenceWeight: question.evidence_weight as any,
                        weightInLayer: 1.0 / layerData.total_questions,
                        scoringLogic: {},
                        redFlags: [],
                    },
                });
            }
        }
    }

    console.log('\n✅ Trust layers loaded successfully!\n');
    console.log('🎉 Trust Intelligence Layer seeded successfully (Partial)!\n');
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
        if (e instanceof Error) {
            console.error('Stack:', e.stack);
        }
        process.exit(1);
    });
