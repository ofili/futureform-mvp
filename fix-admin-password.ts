import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixAdminPassword() {
    const email = 'admin@futureform.com';
    const password = 'password123';

    console.log('\n🔧 Fixing admin password...');
    console.log('📧 Email:', email);
    console.log('🔑 New password:', password);
    console.log('---');

    // Generate a fresh hash
    const newHash = await bcrypt.hash(password, 12);
    console.log('🔐 Generated hash:', newHash);

    // Verify it works
    const testMatch = await bcrypt.compare(password, newHash);
    console.log('✅ Hash verification:', testMatch);
    console.log('---');

    // Update the user
    const updated = await prisma.user.update({
        where: { email },
        data: {
            password: newHash,
            emailVerified: true,
            role: 'ADMIN'
        }
    });

    console.log('✅ User updated:', updated.email);
    console.log('👤 Role:', updated.role);
    console.log('📧 Email verified:', updated.emailVerified);
    console.log('---');

    // Test the login again
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        const loginTest = await bcrypt.compare(password, user.password);
        console.log('🔓 Login test:', loginTest ? '✅ SUCCESS' : '❌ FAILED');
    }

    await prisma.$disconnect();
    console.log('\n✅ Done! Try logging in now.');
}

fixAdminPassword().catch(console.error);
