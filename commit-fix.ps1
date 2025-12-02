# Fix Vercel Build - Commit Script
# Run this after freeing up disk space

Write-Host "Committing tsconfig.json changes..." -ForegroundColor Cyan

# Add the file
git add tsconfig.json

# Commit
git commit -m "fix: Exclude Prisma seed files from TypeScript compilation

- Prevents build errors when seed files reference Prisma models  
- Seed files are only run during database seeding, not during build"

# Push to main
git push origin main

Write-Host "`nDone! Vercel should now rebuild successfully." -ForegroundColor Green
Write-Host "Check your Vercel dashboard for the new deployment." -ForegroundColor Yellow
