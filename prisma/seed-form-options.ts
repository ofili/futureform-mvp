import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding comprehensive form options...');

    const formOptions = [
        // ========== SECTORS ==========
        { category: 'sector', value: 'infrastructure', label: 'Infrastructure', displayOrder: 1, isActive: true },
        { category: 'sector', value: 'digital_transformation', label: 'Digital Transformation', displayOrder: 2, isActive: true },
        { category: 'sector', value: 'health', label: 'Health', displayOrder: 3, isActive: true },
        { category: 'sector', value: 'education', label: 'Education', displayOrder: 4, isActive: true },
        { category: 'sector', value: 'agriculture', label: 'Agriculture', displayOrder: 5, isActive: true },
        { category: 'sector', value: 'financial_services', label: 'Financial Services', displayOrder: 6, isActive: true },
        { category: 'sector', value: 'climate', label: 'Climate', displayOrder: 7, isActive: true },
        { category: 'sector', value: 'governance', label: 'Governance', displayOrder: 8, isActive: true },
        { category: 'sector', value: 'energy', label: 'Energy', displayOrder: 9, isActive: true },
        { category: 'sector', value: 'technology', label: 'Technology', displayOrder: 10, isActive: true },
        { category: 'sector', value: 'healthcare', label: 'Healthcare', displayOrder: 11, isActive: true },
        { category: 'sector', value: 'consulting', label: 'Consulting', displayOrder: 12, isActive: true },
        { category: 'sector', value: 'government', label: 'Government', displayOrder: 13, isActive: true },
        { category: 'sector', value: 'other', label: 'Other', displayOrder: 14, isActive: true },

        // ========== REGIONS ==========
        { category: 'region', value: 'sub_saharan_africa', label: 'Sub-Saharan Africa', displayOrder: 1, isActive: true },
        { category: 'region', value: 'mena', label: 'MENA', displayOrder: 2, isActive: true },
        { category: 'region', value: 'south_asia', label: 'South Asia', displayOrder: 3, isActive: true },
        { category: 'region', value: 'east_asia_pacific', label: 'East Asia & Pacific', displayOrder: 4, isActive: true },
        { category: 'region', value: 'latin_america', label: 'Latin America', displayOrder: 5, isActive: true },
        { category: 'region', value: 'eastern_europe_central_asia', label: 'Eastern Europe & Central Asia', displayOrder: 6, isActive: true },
        { category: 'region', value: 'north_america', label: 'North America', displayOrder: 7, isActive: true },
        { category: 'region', value: 'western_europe', label: 'Western Europe', displayOrder: 8, isActive: true },

        // ========== DEPARTMENTS ==========
        { category: 'department', value: 'executive', label: 'Executive', displayOrder: 1, isActive: true },
        { category: 'department', value: 'operations', label: 'Operations', displayOrder: 2, isActive: true },
        { category: 'department', value: 'technology', label: 'Technology', displayOrder: 3, isActive: true },
        { category: 'department', value: 'finance', label: 'Finance', displayOrder: 4, isActive: true },
        { category: 'department', value: 'program_project', label: 'Program/Project', displayOrder: 5, isActive: true },
        { category: 'department', value: 'external_affairs', label: 'External Affairs', displayOrder: 6, isActive: true },
        { category: 'department', value: 'human_resources', label: 'Human Resources', displayOrder: 7, isActive: true },
        { category: 'department', value: 'legal', label: 'Legal', displayOrder: 8, isActive: true },
        { category: 'department', value: 'other', label: 'Other', displayOrder: 9, isActive: true },

        // ========== RELATIONSHIP STAGES ==========
        { category: 'relationship_stage', value: 'lead', label: 'Lead', displayOrder: 1, isActive: true },
        { category: 'relationship_stage', value: 'contacted', label: 'Contacted', displayOrder: 2, isActive: true },
        { category: 'relationship_stage', value: 'discovery', label: 'Discovery', displayOrder: 3, isActive: true },
        { category: 'relationship_stage', value: 'pilot', label: 'Pilot', displayOrder: 4, isActive: true },
        { category: 'relationship_stage', value: 'active_client', label: 'Active Client', displayOrder: 5, isActive: true },
        { category: 'relationship_stage', value: 'churned', label: 'Churned', displayOrder: 6, isActive: true },

        // ========== SOURCES ==========
        { category: 'source', value: 'referral', label: 'Referral', displayOrder: 1, isActive: true },
        { category: 'source', value: 'inbound', label: 'Inbound', displayOrder: 2, isActive: true },
        { category: 'source', value: 'outbound', label: 'Outbound', displayOrder: 3, isActive: true },
        { category: 'source', value: 'conference', label: 'Conference', displayOrder: 4, isActive: true },
        { category: 'source', value: 'partnership', label: 'Partnership', displayOrder: 5, isActive: true },
        { category: 'source', value: 'website', label: 'Website', displayOrder: 6, isActive: true },
        { category: 'source', value: 'social_media', label: 'Social Media', displayOrder: 7, isActive: true },

        // ========== PROJECT TYPES (New Deployment, Upgrade, etc.) ==========
        { category: 'project_type', value: 'new_deployment', label: 'New Deployment', displayOrder: 1, isActive: true },
        { category: 'project_type', value: 'upgrade', label: 'Upgrade', displayOrder: 2, isActive: true },
        { category: 'project_type', value: 'due_diligence', label: 'Due Diligence', displayOrder: 3, isActive: true },
        { category: 'project_type', value: 'vendor_evaluation', label: 'Vendor Evaluation', displayOrder: 4, isActive: true },
        { category: 'project_type', value: 'pilot_program', label: 'Pilot Program', displayOrder: 5, isActive: true },
        { category: 'project_type', value: 'expansion', label: 'Expansion', displayOrder: 6, isActive: true },
        { category: 'project_type', value: 'migration', label: 'Migration', displayOrder: 7, isActive: true },

        // ========== ASSESSMENT TYPES (Purpose of Assessment) ==========
        { category: 'assessment_type', value: 'PRE_INVESTMENT_DUE_DILIGENCE', label: 'Pre-investment due diligence', displayOrder: 1, isActive: true },
        { category: 'assessment_type', value: 'VENDOR_SELECTION_PROCUREMENT', label: 'Vendor selection / procurement', displayOrder: 2, isActive: true },
        { category: 'assessment_type', value: 'PORTFOLIO_MONITORING', label: 'Portfolio monitoring (existing partners)', displayOrder: 3, isActive: true },
        { category: 'assessment_type', value: 'GOVERNANCE_AUDIT', label: 'Governance audit', displayOrder: 4, isActive: true },
        { category: 'assessment_type', value: 'MULTI_STAKEHOLDER_ALIGNMENT', label: 'Multi-stakeholder alignment', displayOrder: 5, isActive: true },

        { category: 'project_status', value: 'PLANNING', label: 'Planning', displayOrder: 1, isActive: true },
        { category: 'project_status', value: 'ACTIVE', label: 'Active', displayOrder: 2, isActive: true },
        { category: 'project_status', value: 'COMPLETED', label: 'Completed', displayOrder: 3, isActive: true },
        { category: 'project_status', value: 'ARCHIVED', label: 'Archived', displayOrder: 4, isActive: true },

        // ========== BUDGET RANGES ==========
        { category: 'budget_range', value: 'under_50k', label: 'Under $50k', displayOrder: 1, isActive: true },
        { category: 'budget_range', value: '50k_150k', label: '$50k - $150k', displayOrder: 2, isActive: true },
        { category: 'budget_range', value: '150k_500k', label: '$150k - $500k', displayOrder: 3, isActive: true },
        { category: 'budget_range', value: '500k_1m', label: '$500k - $1M', displayOrder: 4, isActive: true },
        { category: 'budget_range', value: '1m_5m', label: '$1M - $5M', displayOrder: 5, isActive: true },
        { category: 'budget_range', value: 'over_5m', label: 'Over $5M', displayOrder: 6, isActive: true },

        // ========== MATURITY LEVELS ==========
        { category: 'maturity_level', value: 'nascent', label: 'Nascent', displayOrder: 1, isActive: true },
        { category: 'maturity_level', value: 'developing', label: 'Developing', displayOrder: 2, isActive: true },
        { category: 'maturity_level', value: 'established', label: 'Established', displayOrder: 3, isActive: true },
        { category: 'maturity_level', value: 'mature', label: 'Mature', displayOrder: 4, isActive: true },
        { category: 'maturity_level', value: 'optimized', label: 'Optimized', displayOrder: 5, isActive: true },

        // ========== ORGANIZATION TYPES ==========
        { category: 'organization_type', value: 'government', label: 'Government', displayOrder: 1, isActive: true },
        { category: 'organization_type', value: 'ngo', label: 'NGO', displayOrder: 2, isActive: true },
        { category: 'organization_type', value: 'private_sector', label: 'Private Sector', displayOrder: 3, isActive: true },
        { category: 'organization_type', value: 'multilateral', label: 'Multilateral', displayOrder: 4, isActive: true },
        { category: 'organization_type', value: 'foundation', label: 'Foundation', displayOrder: 5, isActive: true },
        { category: 'organization_type', value: 'academic', label: 'Academic', displayOrder: 6, isActive: true },
        { category: 'organization_type', value: 'other', label: 'Other', displayOrder: 7, isActive: true },

        // ========== PARTNER TYPES ==========
        { category: 'partner_type', value: 'technology_vendor', label: 'Technology Vendor', displayOrder: 1, isActive: true },
        { category: 'partner_type', value: 'implementation_partner', label: 'Implementation Partner', displayOrder: 2, isActive: true },
        { category: 'partner_type', value: 'government_agency', label: 'Government Agency', displayOrder: 3, isActive: true },
        { category: 'partner_type', value: 'ngo_civil_society', label: 'NGO / Civil Society', displayOrder: 4, isActive: true },
        { category: 'partner_type', value: 'consortium_partner', label: 'Consortium Partner', displayOrder: 5, isActive: true },
        { category: 'partner_type', value: 'data_processor', label: 'Data Processor', displayOrder: 6, isActive: true },
        { category: 'partner_type', value: 'infrastructure_contractor', label: 'Infrastructure Contractor', displayOrder: 7, isActive: true },
        { category: 'partner_type', value: 'internal_department', label: 'Internal Department', displayOrder: 8, isActive: true },
    ];

    let created = 0;
    let updated = 0;

    for (const option of formOptions) {
        const existing = await prisma.formOption.findUnique({
            where: {
                category_value: {
                    category: option.category,
                    value: option.value
                }
            }
        });

        if (existing) {
            await prisma.formOption.update({
                where: { id: existing.id },
                data: option
            });
            updated++;
        } else {
            await prisma.formOption.create({
                data: option
            });
            created++;
        }
    }

    console.log(`✅ Form options seeded: ${created} created, ${updated} updated`);
}

main()
    .catch((e) => {
        console.error('Error seeding form options:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
