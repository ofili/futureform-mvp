import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking DB connection...');
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);

        const users = await prisma.user.findMany();
        console.log('Users:', users);

        const orgCount = await prisma.organization.count();
        console.log(`Org count: ${orgCount}`);

        const orgs = await prisma.organization.findMany();
        console.log('Orgs:', orgs);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
