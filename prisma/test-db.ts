import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing database connection...');
        const userCount = await prisma.user.count();
        console.log(`Connection successful. User count: ${userCount}`);

        console.log('Testing TrustLayer model access...');
        const layerCount = await prisma.trustLayer.count();
        console.log(`TrustLayer count: ${layerCount}`);

        const subDimCount = await prisma.trustSubDimension.count();
        console.log(`TrustSubDimension count: ${subDimCount}`);

        const questionCount = await prisma.trustQuestion.count();
        console.log(`TrustQuestion count: ${questionCount}`);

    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
