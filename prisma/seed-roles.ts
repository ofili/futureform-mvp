import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script for Role-Based Assessment Flow
 * 
 * This script:
 * 1. Seeds standard organizational roles
 * 2. Can be extended to migrate existing assessments
 */

const STANDARD_ROLES = [
    // Finance & Accounting
    {
        name: 'Chief Financial Officer (CFO)',
        description: 'Oversees all financial operations and strategy',
        typicalSeniority: 'C-Level',
        domain: 'Integrity',
    },
    {
        name: 'Finance Manager',
        description: 'Manages day-to-day financial operations',
        typicalSeniority: 'Manager',
        domain: 'Integrity',
    },
    {
        name: 'Accountant',
        description: 'Handles accounting and bookkeeping',
        typicalSeniority: 'Senior',
        domain: 'Integrity',
    },

    // Human Resources
    {
        name: 'Chief Human Resources Officer (CHRO)',
        description: 'Leads HR strategy and people operations',
        typicalSeniority: 'C-Level',
        domain: 'Capability',
    },
    {
        name: 'HR Director',
        description: 'Manages HR department and policies',
        typicalSeniority: 'Director',
        domain: 'Capability',
    },
    {
        name: 'HR Manager',
        description: 'Oversees recruitment, training, and employee relations',
        typicalSeniority: 'Manager',
        domain: 'Capability',
    },

    // Technology
    {
        name: 'Chief Technology Officer (CTO)',
        description: 'Leads technology strategy and infrastructure',
        typicalSeniority: 'C-Level',
        domain: 'Capability',
    },
    {
        name: 'IT Manager',
        description: 'Manages IT systems and support',
        typicalSeniority: 'Manager',
        domain: 'Capability',
    },

    // Operations
    {
        name: 'Chief Operating Officer (COO)',
        description: 'Oversees daily operations and processes',
        typicalSeniority: 'C-Level',
        domain: 'Capability',
    },
    {
        name: 'Operations Manager',
        description: 'Manages operational processes and teams',
        typicalSeniority: 'Manager',
        domain: 'Capability',
    },

    // Legal & Compliance
    {
        name: 'General Counsel',
        description: 'Chief legal officer',
        typicalSeniority: 'C-Level',
        domain: 'Integrity',
    },
    {
        name: 'Compliance Officer',
        description: 'Ensures regulatory compliance',
        typicalSeniority: 'Manager',
        domain: 'Integrity',
    },

    // Executive Leadership
    {
        name: 'Chief Executive Officer (CEO)',
        description: 'Overall organizational leadership',
        typicalSeniority: 'C-Level',
        domain: null,
    },
    {
        name: 'Executive Director',
        description: 'Senior leadership role',
        typicalSeniority: 'Director',
        domain: null,
    },

    // Program & Project Management
    {
        name: 'Program Director',
        description: 'Oversees program implementation',
        typicalSeniority: 'Director',
        domain: 'Capability',
    },
    {
        name: 'Project Manager',
        description: 'Manages specific projects',
        typicalSeniority: 'Manager',
        domain: 'Capability',
    },
];

async function seedRoles() {
    console.log('🌱 Seeding roles...');

    for (const role of STANDARD_ROLES) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: role,
            create: role,
        });
        console.log(`  ✓ ${role.name}`);
    }

    console.log(`✅ Seeded ${STANDARD_ROLES.length} roles`);
}

async function main() {
    try {
        await seedRoles();

        console.log('\n✅ Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
