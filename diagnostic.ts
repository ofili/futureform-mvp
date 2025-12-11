
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Starting diagnostic check...');

    try {
        // Check Projects
        const projectCount = await prisma.project.count();
        console.log(`✅ Projects found: ${projectCount}`);

        if (projectCount > 0) {
            const firstProject = await prisma.project.findFirst({
                select: { id: true, name: true, type: true }
            });
            console.log('   Sample Project:', firstProject);
        }

        // Check Partner Types
        const partnerTypeCount = await prisma.formOption.count({
            where: { category: 'PARTNER_TYPE' }
        });
        console.log(`✅ Partner Types found: ${partnerTypeCount}`);

        if (partnerTypeCount === 0) {
            console.log('   ⚠️ WARNING: No Partner Types found. Seeding required.');
        } else {
            const firstType = await prisma.formOption.findFirst({
                where: { category: 'PARTNER_TYPE' },
                select: { label: true, value: true }
            });
            console.log('   Sample Partner Type:', firstType);
        }

        // Check Users (for context)
        const userCount = await prisma.user.count();
        console.log(`✅ Users found: ${userCount}`);

    } catch (error) {
        console.error('❌ Database connectivity error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
