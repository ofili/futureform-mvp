const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('='.repeat(60));
        console.log('TRUST INTELLIGENCE LAYER - DATA VERIFICATION REPORT');
        console.log('='.repeat(60));
        console.log();

        // Count all records
        const layerCount = await prisma.trustLayer.count();
        const subDimCount = await prisma.trustSubDimension.count();
        const questionCount = await prisma.trustQuestion.count();

        console.log('📊 RECORD COUNTS:');
        console.log(`  TrustLayer: ${layerCount} (expected: 6)`);
        console.log(`  TrustSubDimension: ${subDimCount} (expected: ~24)`);
        console.log(`  TrustQuestion: ${questionCount} (expected: ~72)`);
        console.log();

        // Get layer details
        const layers = await prisma.trustLayer.findMany({
            include: {
                _count: {
                    select: { subDimensions: true }
                }
            },
            orderBy: { layerId: 'asc' }
        });

        console.log('📋 LAYER DETAILS:');
        for (const layer of layers) {
            console.log(`  ${layer.layerId} - ${layer.name}`);
            console.log(`    Sub-dimensions: ${layer._count.subDimensions}`);
            console.log(`    Total Questions: ${layer.totalQuestions}`);
            console.log(`    Baseline Weight: ${layer.baselineWeight}`);
        }
        console.log();

        // Verification status
        console.log('✅ VERIFICATION STATUS:');
        const layerOk = layerCount === 6;
        const subDimOk = subDimCount >= 20 && subDimCount <= 30;
        const questionOk = questionCount >= 70 && questionCount <= 90;

        console.log(`  Layers: ${layerOk ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`  Sub-Dimensions: ${subDimOk ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`  Questions: ${questionOk ? '✅ PASS' : '❌ FAIL'}`);
        console.log();

        if (layerOk && subDimOk && questionOk) {
            console.log('🎉 ALL CHECKS PASSED! Trust ontology data loaded successfully.');
        } else {
            console.log('⚠️  Some checks failed. Please review the counts above.');
        }

        console.log();
        console.log('='.repeat(60));

    } catch (e) {
        console.error('❌ Verification failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
