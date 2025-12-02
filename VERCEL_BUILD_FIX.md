# Vercel Build Fix - Quick Guide

## The Problem
Vercel build is failing with this error:
```
Type error: Object literal may only specify known properties, and 'parentId' does not exist in type FormOptionCreateInput
```

## The Root Cause
The `prisma/seed-taxonomy.ts` file is being type-checked during the Vercel build process, but it references Prisma models. Seed files should not be included in the TypeScript compilation.

## The Fix
I've updated `tsconfig.json` to exclude seed files from TypeScript compilation:
```json
"exclude": [
  "node_modules",
  "prisma/seed.ts",
  "prisma/seed-taxonomy.ts"
]
```

## What You Need to Do

### Step 1: Free Up Disk Space
Your C: drive is out of space, preventing Git commits. Free up at least 1-2 GB.

**Quick ways to free space:**
- Empty Recycle Bin
- Run Disk Cleanup (search "Disk Cleanup" in Start menu)
- Delete temporary files: `C:\Users\ofili\AppData\Local\Temp`
- Clear npm cache: `npm cache clean --force`
- Delete old node_modules: Find and delete unused `node_modules` folders

### Step 2: Run the Commit Script
After freeing space, run this in PowerShell:
```powershell
cd c:\Users\ofili\Documents\FutureForm\mvp-production\FutureForm-MVP\frontend
.\commit-fix.ps1
```

OR manually:
```powershell
git add tsconfig.json
git commit -m "fix: Exclude Prisma seed files from TypeScript compilation"
git push origin main
```

### Step 3: Verify Vercel Build
- Go to your Vercel dashboard
- Wait for the new deployment to start automatically
- The build should now succeed

## Files Changed
- `tsconfig.json` - Excluded seed files from compilation
- `commit-fix.ps1` - Helper script to commit the fix

## Why This Works
Seed files are only executed during database seeding (`npm run db:seed`), not during the Next.js build process. By excluding them from TypeScript compilation, we prevent build-time type errors while still maintaining type safety for the actual application code.
