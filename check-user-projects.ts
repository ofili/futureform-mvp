
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Projects for Admin User...');

    try {
        const user = await prisma.user.findFirst({
            where: { email: 'admin@futureform.com' },
            include: { organizations: true }
        });

        if (!user) {
            console.log('❌ Admin user not found');
            return;
        }

        console.log(`👤 User found: ${user.email} (${user.id})`);

        const orgIds = user.organizations.map(mo => mo.organizationId);
        console.log('User Org Ids:', orgIds);

        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { organizationId: { in: orgIds } },
                    { createdById: user.id }
                ]
            }
        });

        console.log(`📊 Projects visible to user: ${projects.length}`);
        if (projects.length > 0) {
            console.log('Sample:', projects[0].name);
        } else {
            console.log('Reason: No projects found matching org IDs or creator ID.');
        }

    } catch (error) {
        console.error('❌ Error checking projects:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
