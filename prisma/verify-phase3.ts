import { PrismaClient } from '@prisma/client';
import { TrustOntologyService } from '../src/lib/services/trust-ontology.service';

const prisma = new PrismaClient();
const trustOntologyService = new TrustOntologyService();

async function main() {
    console.log('🔍 Verifying Phase 3: Assessment Integration Logic');

    // 1. Fetch a Partner Type
    console.log('\n1. Fetching a Partner Type...');
    const partnerTypes = await trustOntologyService.getPartnerTypes();
    if (partnerTypes.total === 0) {
        console.error('❌ No partner types found. Seed data missing?');
        return;
    }
    const partnerType = partnerTypes.partnerTypes[0];
    console.log(`✅ Found Partner Type: ${partnerType.name} (${partnerType.id})`);

    // 2. Fetch Questions for Partner Type
    console.log('\n2. Fetching Questions for Partner Type...');
    const questions = await trustOntologyService.getQuestionsForPartnerType(partnerType.id);
    console.log(`✅ Found ${questions.length} questions for this partner type.`);

    if (questions.length === 0) {
        console.warn('⚠️ No questions found for this partner type. Check mapping.');
    } else {
        console.log(`   Sample Question: ${questions[0].text.substring(0, 50)}...`);
    }

    // 3. Verify Mapping Logic (Simulating API)
    console.log('\n3. Verifying Question Mapping Logic...');
    const mappedQuestions = questions.map((q: any, index: number) => ({
        id: q.id,
        questionId: q.id,
        assessmentId: 'mock-assessment-id',
        question: {
            id: q.id,
            text: q.text,
            domain: q.subDimension?.name || 'Trust',
        },
        assignedRoleId: null,
        assignedSeniority: 'Manager',
        evidenceRequirements: q.evidenceRequired ? [q.evidenceRequired] : [],
        order: index + 1,
        aiConfidence: 1.0,
        aiRationale: 'Selected based on partner type',
        customized: false,
    }));

    if (mappedQuestions.length > 0) {
        console.log('✅ Mapping successful.');
        console.log('   Mapped Question Structure:', JSON.stringify(mappedQuestions[0], null, 2));
    } else {
        console.warn('⚠️ No questions to map.');
    }

    // 4. Verify TrustRequiredRole fetching
    console.log('\n4. Verifying Required Roles...');
    const roles = await trustOntologyService.getRequiredRoles(partnerType.id);
    console.log(`✅ Found ${roles.length} required roles for ${partnerType.name}.`);
    if (roles.length > 0) {
        console.log(`   Sample Role: ${roles[0].name}`);
    } else {
        console.warn('⚠️ No required roles found.');
    }

    console.log('\n🎉 Phase 3 Logic Verification Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
