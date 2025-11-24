# PowerShell script to apply Prisma migration with automatic confirmation
# This will reset the development database and apply the partner model migration

Write-Host "🚀 Applying Partner Model Migration..." -ForegroundColor Cyan
Write-Host ""

# Run migration with automatic 'yes' confirmation
$env:PRISMA_MIGRATE_SKIP_GENERATE = "true"
"y" | npx prisma migrate dev --name add_partner_models

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Next step: Run data migration script" -ForegroundColor Yellow
    Write-Host "   npx ts-node prisma/migrations/migrate-partner-data.ts" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Migration failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
