const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testEndpoints() {
    console.log('🔍 Phase 2: API Endpoint Verification\n');
    console.log('='.repeat(60));

    try {
        // 1. GET /trust/layers
        console.log('\n📡 1. Testing GET /trust/layers...');
        const layersRes = await fetch(`${BASE_URL}/trust/layers`);
        if (layersRes.ok) {
            const json = await layersRes.json();
            const data = json.data;
            console.log(`   ✅ Status: ${layersRes.status}`);
            console.log(`   ✅ Layers found: ${data?.length}`);
            if (data?.length === 6) console.log('   ✅ Count matches expected (6)');
        } else {
            console.error(`   ❌ Failed: ${layersRes.status} ${layersRes.statusText}`);
        }

        // 2. GET /trust/questions
        console.log('\n📡 2. Testing GET /trust/questions...');
        const questionsRes = await fetch(`${BASE_URL}/trust/questions`);
        if (questionsRes.ok) {
            const json = await questionsRes.json();
            const data = json.data; // Assuming this also follows the wrapper pattern, checking...
            // Actually, let's check questions route too, but assuming wrapper for consistency
            console.log(`   ✅ Status: ${questionsRes.status}`);
            console.log(`   ✅ Questions found: ${data?.length}`);
            if (data?.length > 0) console.log('   ✅ Questions returned successfully');
        } else {
            console.error(`   ❌ Failed: ${questionsRes.status} ${questionsRes.statusText}`);
        }

        // 3. GET /trust/partner-types
        console.log('\n📡 3. Testing GET /trust/partner-types...');
        const ptRes = await fetch(`${BASE_URL}/trust/partner-types`);
        let partnerTypeId = '';
        if (ptRes.ok) {
            const json = await ptRes.json();
            const data = json.data;
            console.log(`   ✅ Status: ${ptRes.status}`);
            console.log(`   ✅ Partner Types found: ${data?.length}`);
            if (data?.length > 0) {
                partnerTypeId = data[0].id;
                console.log(`   ℹ️  Using Partner Type ID for next tests: ${partnerTypeId}`);
            }
        } else {
            console.error(`   ❌ Failed: ${ptRes.status} ${ptRes.statusText}`);
        }

        if (partnerTypeId) {
            // 4. GET /trust/partner-types/[id]
            console.log(`\n📡 4. Testing GET /trust/partner-types/${partnerTypeId}...`);
            const singlePtRes = await fetch(`${BASE_URL}/trust/partner-types/${partnerTypeId}`);
            if (singlePtRes.ok) {
                const json = await singlePtRes.json();
                const data = json.data || json; // Handle potential wrapper or direct return
                console.log(`   ✅ Status: ${singlePtRes.status}`);
                console.log(`   ✅ Name: ${data.name}`);
                console.log(`   ✅ Roles: ${data.requiredRoles?.length || 0}`);
            } else {
                console.error(`   ❌ Failed: ${singlePtRes.status} ${singlePtRes.statusText}`);
            }

            // 5. GET /trust/partner-types/[id]/questions
            console.log(`\n📡 5. Testing GET /trust/partner-types/${partnerTypeId}/questions...`);
            const ptQuestionsRes = await fetch(`${BASE_URL}/trust/partner-types/${partnerTypeId}/questions`);
            if (ptQuestionsRes.ok) {
                const json = await ptQuestionsRes.json();
                const data = Array.isArray(json) ? json : (json.data || []); // Handle potential wrapper or direct return
                console.log(`   ✅ Status: ${ptQuestionsRes.status}`);
                console.log(`   ✅ Questions for Partner Type: ${data.length}`);
            } else {
                console.error(`   ❌ Failed: ${ptQuestionsRes.status} ${ptQuestionsRes.statusText}`);
            }
        } else {
            console.log('\n⚠️  Skipping specific partner type tests (no ID found)');
        }

    } catch (error) {
        console.error('❌ Error running API tests:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   👉 Is the server running on localhost:3000?');
        }
    }
}

testEndpoints();
