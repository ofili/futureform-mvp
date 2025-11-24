const fs = require('fs');

// Read the schema file
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Fix the corrupted @@map lines
// Replace lines 1222-1223 which have: @@map(\ and system_logs\)
content = content.replace(/@@map\(\\\r?\n?system_logs\\\)/g, '@@map("system_logs")');

// Write it back
fs.writeFileSync('prisma/schema.prisma', content, 'utf8');

console.log('✅ Fixed Prisma schema');
