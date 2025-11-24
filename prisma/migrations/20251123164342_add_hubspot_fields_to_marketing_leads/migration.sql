-- AlterTable
ALTER TABLE "marketing_leads" ADD COLUMN     "hubspotContactId" TEXT,
ADD COLUMN     "hubspotSyncError" TEXT,
ADD COLUMN     "hubspotSynced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hubspotSyncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "marketing_leads_hubspotSynced_idx" ON "marketing_leads"("hubspotSynced");
