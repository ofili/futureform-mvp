/**
 * Data Migration Script: Migrate Partner Data to New Model
 * 
 * This script migrates existing partner data from the Assessment table
 * to the new Partner/PartnerAlias model structure.
 * 
 * Run this AFTER applying the schema migration.
 * 
 * Usage: npx ts-node prisma/migrations/migrate-partner-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AssessmentPartnerData {
    id: string;
    partnerName: string;
    partnerType: string;
    partnerId: string;
    project: {
        organizationId: string | null;
    };
}

async function migratePartnerData() {
    console.log('🚀 Starting partner data migration...\n');

    try {
        // Step 1: Fetch all assessments with partner data
        console.log('📊 Fetching assessments with partner data...');
        const assessments = await prisma.assessment.findMany({
            where: {
                partnerName: { not: null },
            },
            select: {
                id: true,
                partnerName: true,
                partnerType: true,
                partnerId: true,
                project: {
                    select: {
                        organizationId: true,
                    },
                },
            },
        }) as AssessmentPartnerData[];

        console.log(`✓ Found ${assessments.length} assessments with partner data\n`);

        // Step 2: Group by partner name (case-insensitive) for deduplication
        console.log('🔍 Identifying unique partners...');
        const partnerMap = new Map<string, AssessmentPartnerData[]>();

        for (const assessment of assessments) {
            const key = assessment.partnerName.toLowerCase().trim();
            if (!partnerMap.has(key)) {
                partnerMap.set(key, []);
            }
            partnerMap.get(key)!.push(assessment);
        }

        console.log(`✓ Found ${partnerMap.size} unique partners\n`);

        // Step 3: Create Partner records and PartnerAliases
        console.log('📝 Creating Partner records and PartnerAliases...');
        let partnersCreated = 0;
        let aliasesCreated = 0;
        let assessmentsUpdated = 0;

        for (const [partnerKey, partnerAssessments] of Array.from(partnerMap.entries())) {
            // Use the first assessment's data as the canonical partner data
            const firstAssessment = partnerAssessments[0];
            const partnerName = firstAssessment.partnerName;
            const partnerType = firstAssessment.partnerType;

            // Check if Partner already exists (in case script is run multiple times)
            let partner = await prisma.partner.findFirst({
                where: {
                    legalName: {
                        equals: partnerName,
                        mode: 'insensitive',
                    },
                },
            });

            if (!partner) {
                // Create new Partner
                partner = await prisma.partner.create({
                    data: {
                        legalName: partnerName,
                        sector: partnerType,
                        createdByOrgId: firstAssessment.project.organizationId || undefined,
                        usageCount: partnerAssessments.length,
                        verification: 'UNVERIFIED',
                    },
                });
                partnersCreated++;
                console.log(`  ✓ Created Partner: ${partnerName}`);
            } else {
                // Update usage count
                await prisma.partner.update({
                    where: { id: partner.id },
                    data: {
                        usageCount: {
                            increment: partnerAssessments.length,
                        },
                    },
                });
                console.log(`  ↻ Updated Partner: ${partnerName} (already existed)`);
            }

            // Group assessments by organization
            const orgMap = new Map<string, AssessmentPartnerData[]>();
            for (const assessment of partnerAssessments) {
                const orgId = assessment.project.organizationId;
                if (orgId) {
                    if (!orgMap.has(orgId)) {
                        orgMap.set(orgId, []);
                    }
                    orgMap.get(orgId)!.push(assessment);
                }
            }

            // Create PartnerAlias for each organization
            for (const [orgId, orgAssessments] of Array.from(orgMap.entries())) {
                // Check if PartnerAlias already exists
                let alias = await prisma.partnerAlias.findUnique({
                    where: {
                        partnerId_organizationId: {
                            partnerId: partner.id,
                            organizationId: orgId,
                        },
                    },
                });

                if (!alias) {
                    // Create PartnerAlias
                    alias = await prisma.partnerAlias.create({
                        data: {
                            partnerId: partner.id,
                            organizationId: orgId,
                            displayName: partnerName,
                            cachedSector: partnerType,
                            relationshipStatus: 'Active',
                            visibility: true,
                        },
                    });
                    aliasesCreated++;
                    console.log(`    ✓ Created PartnerAlias for org ${orgId.substring(0, 8)}...`);
                }

                // Update all assessments for this org to reference the new Partner and PartnerAlias
                for (const assessment of orgAssessments) {
                    await prisma.assessment.update({
                        where: { id: assessment.id },
                        data: {
                            partnerGlobalId: partner.id,
                            partnerAliasId: alias.id,
                        },
                    });
                    assessmentsUpdated++;
                }
            }
        }

        console.log('\n✅ Migration completed successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   Partners created: ${partnersCreated}`);
        console.log(`   PartnerAliases created: ${aliasesCreated}`);
        console.log(`   Assessments updated: ${assessmentsUpdated}`);

        // Step 4: Verification
        console.log('\n🔍 Verifying migration...');
        const assessmentsWithNewRefs = await prisma.assessment.count({
            where: {
                AND: [
                    { partnerGlobalId: { not: null } },
                    { partnerAliasId: { not: null } },
                ],
            },
        });

        console.log(`✓ ${assessmentsWithNewRefs} assessments now have new partner references`);

        if (assessmentsWithNewRefs === assessments.length) {
            console.log('✅ All assessments migrated successfully!\n');
        } else {
            console.log(`⚠️  Warning: ${assessments.length - assessmentsWithNewRefs} assessments missing new references\n`);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migratePartnerData()
    .then(() => {
        console.log('🎉 Partner data migration complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration error:', error);
        process.exit(1);
    });
