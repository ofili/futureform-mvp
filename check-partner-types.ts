
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const options = await prisma.formOption.findMany({
        where: { category: 'PARTNER_TYPE' },
    });
    console.log('PARTNER_TYPE options count:', options.length);
    console.log('Options:', JSON.stringify(options, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
