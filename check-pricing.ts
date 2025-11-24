import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const packages = await prisma.creditPricing.findMany({
        orderBy: { displayOrder: 'asc' },
        select: { packageName: true, priceUSD: true, creditAmount: true }
    });
    console.log('Current Packages:', JSON.stringify(packages, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
