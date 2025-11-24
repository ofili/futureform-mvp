import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.log('Usage: tsx check-user-role.ts <email>');
        process.exit(1);
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log(`❌ User not found: ${email}`);
        return;
    }

    console.log('\n=== User Information ===');
    console.log('Email:', user.email);
    console.log('Name:', `${user.firstName} ${user.lastName}`);
    console.log('Role:', user.role);
    console.log('Email Verified:', user.emailVerified);
    console.log('Created:', user.createdAt);

    if (user.role !== 'ADMIN') {
        console.log('\n⚠️  This user does NOT have ADMIN role');
        console.log('Current role:', user.role);
        console.log('\nTo fix this, run:');
        console.log(`  tsx create-admin.ts`);
        console.log('Or update manually in Prisma Studio');
    } else {
        console.log('\n✅ This user has ADMIN role');
        console.log('\nIf you\'re still getting 401 errors:');
        console.log('1. Log out of the application');
        console.log('2. Log back in to refresh your session');
        console.log('3. Try the API request again');
    }
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
