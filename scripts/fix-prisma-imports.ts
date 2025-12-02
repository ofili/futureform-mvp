// Script to fix all incorrect prisma imports
// Run with: npx tsx scripts/fix-prisma-imports.ts

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filesToFix = [
    'src/lib/services/creditService.ts',
    'src/lib/notifications.ts',
    'src/app/api/projects/[id]/route.ts',
    'src/app/api/projects/route.ts',
    'src/app/api/v1/billing/history/route.ts',
    'src/app/api/v1/billing/credits/route.ts',
    'src/app/api/v1/billing/checkout/route.ts',
    'src/app/api/v1/admin/logs/route.ts',
    'src/app/api/users/me/credits/route.ts',
    'src/app/api/notifications/route.ts',
    'src/app/api/organization/invitations/route.ts',
    'src/app/api/admin/users/route.ts',
    'src/app/api/dashboard/route.ts',
    'src/app/api/credits/purchase/route.ts',
    'src/app/api/assessments/route.ts',
    'src/app/api/assessments/[id]/route.ts',
];

const oldImport = "import { prisma } from '@/lib/db'";
const newImport = "import prisma from '@/lib/prisma'";

let fixedCount = 0;

for (const file of filesToFix) {
    const filePath = join(process.cwd(), file);

    try {
        let content = readFileSync(filePath, 'utf-8');

        if (content.includes(oldImport)) {
            content = content.replace(oldImport, newImport);
            writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ Fixed: ${file}`);
            fixedCount++;
        } else {
            console.log(`⏭️  Skipped (already fixed): ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error fixing ${file}:`, error);
    }
}

console.log(`\n✨ Fixed ${fixedCount} files!`);
