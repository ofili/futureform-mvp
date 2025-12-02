const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Check if organization exists, if not create one
        let org = await prisma.organization.findFirst();
        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: 'Test Org',
                    type: 'CORPORATE',
                    sectorFocus: 'Technology',
                    region: 'North America',
                    website: 'https://test.com'
                }
            });
            console.log(`Created Org: ${org.id}`);
        }

        // Create Project
        const project = await prisma.project.create({
            data: {
                name: 'Trust Assessment Test Project',
                description: 'Project for testing trust intelligence',
                organizationId: org.id,
                status: 'PLANNING',
                startDate: new Date(),
                type: 'IMPLEMENTATION'
            }
        });

        console.log(`PROJECT_ID=${project.id}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
