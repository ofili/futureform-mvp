const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const project = await prisma.project.findFirst();
        if (project) {
            console.log(`PROJECT_ID=${project.id}`);
        } else {
            console.log('NO_PROJECT');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
