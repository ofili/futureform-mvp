import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@futureform.com';
    const password = 'Admin123!'; // Change this to your preferred password

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log('Admin user already exists:', email);
        console.log('Updating to ensure ADMIN role...');

        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });

        console.log('✓ User role updated to ADMIN');
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
        data: {
            email,
            firstName: 'Admin',
            lastName: 'User',
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: true,
        }
    });

    console.log('✓ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', user.role);
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
