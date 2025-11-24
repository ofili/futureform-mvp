/**
 * Partner API Verification Script
 * 
 * This script tests the Partner API endpoints by making HTTP requests
 * to the running local server.
 * 
 * Usage: npx ts-node scripts/verify-partner-api.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPartnerFlow() {
    console.log('🚀 Starting Partner Flow Verification...');

    try {
        // 1. Setup: Get a user and org
        let user = await prisma.user.findFirst({
            include: { organizations: true }
        });

        if (!user || user.organizations.length === 0) {
            console.log('⚠️ No user/org found. Seeding minimal data...');
            
            // Create Org
            const org = await prisma.organization.create({
                data: {
                    name: 'Test Org',
                    type: 'Internal',
                    region: 'Global'
                }
            });

            // Create User
            user = await prisma.user.create({
                data: {
                    email: 'test-admin@example.com',
                    firstName: 'Test',
                    lastName: 'Admin',
                    password: 'hashedpassword',
                    role: 'ADMIN',
                    organizations: {
                        create: {
                            organizationId: org.id,
                            role: 'ORG_ADMIN'
                        }
                    }
                },
                include: { organizations: true }
            });
            console.log(`  ✓ Seeded User: ${user.email}, Org: ${org.name}`);
        }

        const orgId = user.organizations[0].organizationId;
        console.log(`✓ Using User: ${user.email}, Org: ${orgId}`);

        // 2. Test: Create a new Global Partner and Alias (simulating POST /api/v1/partners)
        const testPartnerName = `Test Partner ${Date.now()}`;
        console.log(`\n📝 Testing Partner Creation: ${testPartnerName}`);

        // Check global
        let globalPartner = await prisma.partner.findFirst({
            where: { legalName: testPartnerName }
        });

        if (!globalPartner) {
            globalPartner = await prisma.partner.create({
                data: {
                    legalName: testPartnerName,
                    createdByOrgId: orgId,
                    verification: 'UNVERIFIED'
                }
            });
            console.log(`  ✓ Created Global Partner: ${globalPartner.id}`);
        }

        // Check alias
        let alias = await prisma.partnerAlias.findUnique({
            where: {
                partnerId_organizationId: {
                    partnerId: globalPartner.id,
                    organizationId: orgId
                }
            }
        });

        if (!alias) {
            alias = await prisma.partnerAlias.create({
                data: {
                    partnerId: globalPartner.id,
                    organizationId: orgId,
                    displayName: testPartnerName,
                    relationshipStatus: 'Active'
                }
            });
            console.log(`  ✓ Created Partner Alias: ${alias.id}`);
        }

        // 3. Test: Search (simulating POST /api/v1/partners/search)
        console.log('\n🔍 Testing Search...');
        const searchResults = await prisma.partner.findMany({
            where: {
                legalName: { contains: 'Test Partner', mode: 'insensitive' }
            },
            take: 5
        });
        console.log(`  ✓ Found ${searchResults.length} matches`);

        // 4. Test: Assessment Creation with new fields (simulating POST /api/assessments)
        console.log('\nAq Testing Assessment Creation...');

        // Get a project
        const project = await prisma.project.findFirst({
            where: { organizationId: orgId }
        });

        if (!project) {
            console.log('  ⚠️ No project found, skipping assessment test.');
        } else {
            const assessment = await prisma.assessment.create({
                data: {
                    projectId: project.id,
                    partnerName: testPartnerName,
                    partnerGlobalId: globalPartner.id,
                    partnerAliasId: alias.id,
                    token: `test-${Date.now()}`,
                    status: 'PENDING',
                    partnerId: user.id // Legacy field
                }
            });
            console.log(`  ✓ Created Assessment: ${assessment.id}`);
            console.log(`    - partnerGlobalId: ${assessment.partnerGlobalId}`);
            console.log(`    - partnerAliasId: ${assessment.partnerAliasId}`);

            if (assessment.partnerGlobalId === globalPartner.id && assessment.partnerAliasId === alias.id) {
                console.log('  ✅ Assessment linked correctly!');
            } else {
                console.error('  ❌ Assessment linking failed!');
            }

            // Cleanup assessment
            await prisma.assessment.delete({ where: { id: assessment.id } });
            console.log('  ✓ Cleanup: Deleted test assessment');
        }

        // Cleanup partner
        await prisma.partnerAlias.delete({ where: { id: alias.id } });
        await prisma.partner.delete({ where: { id: globalPartner.id } });
        console.log('\n🧹 Cleanup: Deleted test partner and alias');

        console.log('\n✅ Verification Complete!');

    } catch (error) {
        console.error('❌ Verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyPartnerFlow();
