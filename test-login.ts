import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
    const email = 'admin@futureform.com';
    const password = 'password123';

    console.log('\n🔍 Testing login for:', email);
    console.log('🔑 Password:', password);
    console.log('---');

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('❌ User not found in database');
        process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('📧 Email verified:', user.emailVerified);
    console.log('👤 Role:', user.role);
    console.log('🔐 Password hash from DB:', user.password);
    console.log('---');

    const match = await bcrypt.compare(password, user.password);
    console.log('🔓 Password match:', match);

    if (match) {
        console.log('✅ Login would succeed!');
    } else {
        console.log('❌ Login would fail - password mismatch');

        // Test if we can generate a working hash
        console.log('\n🧪 Testing hash generation...');
        const newHash = await bcrypt.hash(password, 12);
        const newMatch = await bcrypt.compare(password, newHash);
        console.log('New hash:', newHash);
        console.log('New hash validates:', newMatch);
    }

    await prisma.$disconnect();
}

testLogin().catch(console.error);
