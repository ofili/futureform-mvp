const fs = require('fs');
const path = require('path');

const ontologyPath = path.join(__dirname, '../ontology_data');

console.log(`Checking ontology path: ${ontologyPath}`);

if (fs.existsSync(ontologyPath)) {
    console.log('✅ Ontology directory exists');
    const files = fs.readdirSync(ontologyPath);
    console.log('Files in ontology directory:');

    files.forEach(file => {
        console.log(` - ${file}`);
        const filePath = path.join(ontologyPath, file);

        if (file.endsWith('.json')) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                JSON.parse(content);
                console.log(`   ✅ Valid JSON`);
            } catch (e) {
                console.error(`   ❌ INVALID JSON: ${e.message}`);
            }
        }

        if (fs.statSync(filePath).isDirectory()) {
            console.log(`   (Directory)`);
            const subFiles = fs.readdirSync(filePath);
            subFiles.forEach(subFile => console.log(`     - ${subFile}`));
        }
    });

} else {
    console.error('❌ Ontology directory NOT FOUND');
}
