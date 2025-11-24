-- CreateTable
CREATE TABLE "marketing_leads" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "sector" TEXT,
    "country" TEXT,
    "source" TEXT NOT NULL,
    "downloadToken" TEXT,
    "tokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "tokenUsedAt" TIMESTAMP(3),
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMP(3),
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "leadScore" INTEGER,
    "metadata" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marketing_leads_downloadToken_key" ON "marketing_leads"("downloadToken");

-- CreateIndex
CREATE INDEX "marketing_leads_email_idx" ON "marketing_leads"("email");

-- CreateIndex
CREATE INDEX "marketing_leads_source_idx" ON "marketing_leads"("source");

-- CreateIndex
CREATE INDEX "marketing_leads_status_idx" ON "marketing_leads"("status");

-- CreateIndex
CREATE INDEX "marketing_leads_converted_idx" ON "marketing_leads"("converted");
