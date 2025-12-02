// Quick test to verify Prisma client has trust models
import { PrismaClient, TrustEvidenceWeight, TrustRoleCriticality } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
    console.log('✅ TrustEvidenceWeight enum:', Object.keys(TrustEvidenceWeight));
    console.log('✅ TrustRoleCriticality enum:', Object.keys(TrustRoleCriticality));

    // Test that trustLayer exists on prisma client
    const layerCount = await prisma.trustLayer.count();
    console.log(`✅ trustLayer model accessible. Count: ${layerCount}`);

    console.log('\n🎉 All Prisma trust models are available!');
}

test()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
