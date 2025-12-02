const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing manual insertion...');

        // Get the first layer
        const layer = await prisma.trustLayer.findFirst();
        if (!layer) {
            throw new Error('No layers found! Run seed script first.');
        }
        console.log(`Found layer: ${layer.name} (${layer.id})`);

        // Try to create a sub-dimension
        const subDimId = "TEST_SUB_DIM_" + Date.now();
        console.log(`Creating sub-dimension with ID: ${subDimId}`);

        const subDim = await prisma.trustSubDimension.create({
            data: {
                dimensionId: subDimId,
                name: "Test Sub Dimension",
                weight: 0.1,
                layerId: layer.id
            }
        });

        console.log(`✅ Created sub-dimension: ${subDim.id}`);

        // Verify count
        const count = await prisma.trustSubDimension.count();
        console.log(`Total sub-dimensions: ${count}`);

        // Clean up
        await prisma.trustSubDimension.delete({ where: { id: subDim.id } });
        console.log('Cleaned up test data');

    } catch (e) {
        console.error('❌ Insertion failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
