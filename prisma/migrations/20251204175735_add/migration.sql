-- CreateEnum
CREATE TYPE "FactType" AS ENUM ('RESPONSE', 'DOCUMENT', 'EXTERNAL_NEWS', 'EXTERNAL_REGISTRY', 'INTERNAL_NOTE');

-- CreateEnum
CREATE TYPE "FactSource" AS ENUM ('RESPONDENT', 'DOCUMENT_UPLOAD', 'NEWS_API', 'COMPANY_REGISTRY', 'ANALYST_INPUT', 'RESEARCH_AGENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "evidence_facts" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT,
    "partnerId" TEXT,
    "factType" "FactType" NOT NULL,
    "source" "FactSource" NOT NULL,
    "sourceUrl" TEXT,
    "rawContent" TEXT NOT NULL,
    "normalizedValue" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectedBy" TEXT,
    "validatedAt" TIMESTAMP(3),
    "validatedBy" TEXT,

    CONSTRAINT "evidence_facts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "evidence_facts" ADD CONSTRAINT "evidence_facts_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
