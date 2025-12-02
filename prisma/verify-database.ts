import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
    console.log('🔍 Phase 1-3 Database Verification\n');
    console.log('='.repeat(60));

    try {
        // 1. Verify Trust Layers
        console.log('\n📊 1. Trust Layers:');
        const layers = await prisma.trustLayer.findMany({
            include: { subDimensions: true }
        });
        console.log(`   ✅ Found ${layers.length} layers (expected: 6)`);
        layers.forEach(layer => {
            console.log(`      - ${layer.layerId}: ${layer.name} (${layer.subDimensions.length} sub-dimensions)`);
        });

        // 2. Verify Sub-Dimensions
        console.log('\n📊 2. Sub-Dimensions:');
        const subDimensions = await prisma.trustSubDimension.count();
        console.log(`   ✅ Found ${subDimensions} sub-dimensions (expected: ~28)`);

        // 3. Verify Questions
        console.log('\n📊 3. Trust Questions:');
        const questions = await prisma.trustQuestion.count();
        console.log(`   ✅ Found ${questions} questions (expected: ~83)`);

        // 4. Verify Partner Types
        console.log('\n📊 4. Partner Types:');
        const partnerTypes = await prisma.trustPartnerType.findMany({
            include: { requiredRoles: true }
        });
        console.log(`   ✅ Found ${partnerTypes.length} partner types`);
        partnerTypes.forEach(pt => {
            console.log(`      - ${pt.name}: ${pt.requiredRoles.length} required roles`);
        });

        // 5. Verify Question-Partner Type Mappings
        console.log('\n📊 5. Question-Partner Type Mappings:');
        const mappings = await prisma.trustPartnerTypeQuestion.count();
        console.log(`   ✅ Found ${mappings} question mappings`);

        // 6. Data Integrity Checks
        console.log('\n📊 6. Data Integrity:');

        // All sub-dimensions should have a layer
        const subDimsWithoutLayer = await prisma.trustSubDimension.count({
            where: { layerId: null as any }
        });
        if (subDimsWithoutLayer === 0) {
            console.log('   ✅ All sub-dimensions have a layer');
        } else {
            console.log(`   ⚠️  Found ${subDimsWithoutLayer} sub-dimensions without a layer`);
        }

        // All questions should have a sub-dimension
        const questionsWithoutSubDim = await prisma.trustQuestion.count({
            where: { subDimensionId: null as any }
        });
        if (questionsWithoutSubDim === 0) {
            console.log('   ✅ All questions have a sub-dimension');
        } else {
            console.log(`   ⚠️  Found ${questionsWithoutSubDim} questions without a sub-dimension`);
        }

        // 7. Sample Data Check
        console.log('\n📊 7. Sample Data:');
        const sampleQuestion = await prisma.trustQuestion.findFirst({
            include: {
                subDimension: {
                    include: { layer: true }
                }
            }
        });
        if (sampleQuestion) {
            console.log(`   ✅ Sample Question: ${sampleQuestion.questionId}`);
            console.log(`      Text: ${sampleQuestion.text.substring(0, 60)}...`);
            console.log(`      Sub-Dimension: ${sampleQuestion.subDimension?.name}`);
            console.log(`      Layer: ${sampleQuestion.subDimension?.layer?.name}`);
            console.log(`      Evidence Weight: ${sampleQuestion.evidenceWeight}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Database Verification Complete!\n');

        // Summary
        const allGood = layers.length === 6 &&
            subDimensions >= 24 &&
            questions >= 72 &&
            subDimsWithoutLayer === 0 &&
            questionsWithoutSubDim === 0;

        if (allGood) {
            console.log('🎉 All checks passed! Database is healthy.\n');
            if (partnerTypes.length === 0) {
                console.log('⚠️  Note: No partner types found. You may need to seed them.\n');
            }
        } else {
            console.log('⚠️  Some checks failed. Review the output above.\n');
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyDatabase();
