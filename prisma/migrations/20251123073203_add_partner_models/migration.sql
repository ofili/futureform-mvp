/*
  Warnings:

  - The values [ORG_ADMIN,PROJECT_ADMIN,REVIEWER,DOMAIN_EXPERT,OBSERVER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `credits` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketNumber]` on the table `support_tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `credits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `support_tickets` table without a default value. This is not possible if the table is not empty.
  - The required column `ticketNumber` was added to the `support_tickets` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "PartnerVerification" AS ENUM ('UNVERIFIED', 'SELF_VERIFIED', 'FUTUREFORM_VERIFIED');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('TECHNICAL', 'BILLING', 'ASSESSMENT_HELP', 'ACCOUNT', 'FEATURE_REQUEST', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrganizationRole" ADD VALUE 'ORG_ADMIN';
ALTER TYPE "OrganizationRole" ADD VALUE 'REVIEWER';
ALTER TYPE "OrganizationRole" ADD VALUE 'DOMAIN_EXPERT';
ALTER TYPE "OrganizationRole" ADD VALUE 'OBSERVER';
ALTER TYPE "OrganizationRole" ADD VALUE 'CREDIT_MANAGER';
ALTER TYPE "OrganizationRole" ADD VALUE 'PROJECT_ADMIN';

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN', 'PARTNER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "credits" DROP CONSTRAINT "credits_userId_fkey";

-- AlterTable
ALTER TABLE "assessment_responses" ADD COLUMN     "assessmentQuestionId" TEXT,
ADD COLUMN     "evidenceFiles" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "aiConfig" JSONB,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "depth" TEXT,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "estimatedRespondents" INTEGER,
ADD COLUMN     "partnerAdminEmail" TEXT,
ADD COLUMN     "partnerAliasId" TEXT,
ADD COLUMN     "partnerGlobalId" TEXT,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "partnerId" DROP NOT NULL,
ALTER COLUMN "partnerName" DROP NOT NULL,
ALTER COLUMN "partnerType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "credits" DROP COLUMN "userId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organization_members" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "tierId" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "changeReadiness" TEXT,
ADD COLUMN     "contractDuration" TEXT,
ADD COLUMN     "contractType" TEXT,
ADD COLUMN     "dataSensitivity" TEXT,
ADD COLUMN     "departmentsInvolved" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "deploymentComplexity" TEXT,
ADD COLUMN     "deploymentScope" TEXT,
ADD COLUMN     "expectedCollaborators" TEXT,
ADD COLUMN     "fundingPartners" TEXT,
ADD COLUMN     "fundingSource" TEXT,
ADD COLUMN     "implementingPartners" TEXT,
ADD COLUMN     "interAgencyCollaboration" TEXT,
ADD COLUMN     "internalTrustClimate" TEXT,
ADD COLUMN     "keyFunctionalAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "knownRisks" TEXT,
ADD COLUMN     "leadAgency" TEXT,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "operationalCapacity" TEXT,
ADD COLUMN     "orgDigitalMaturity" TEXT,
ADD COLUMN     "orgSize" TEXT,
ADD COLUMN     "orgStructure" TEXT,
ADD COLUMN     "prevFailures" TEXT,
ADD COLUMN     "projectSponsor" TEXT,
ADD COLUMN     "projectStage" TEXT,
ADD COLUMN     "regulatoryRequirements" TEXT,
ADD COLUMN     "responsibleDepartments" TEXT,
ADD COLUMN     "seniorityMix" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "steeringCommittee" BOOLEAN,
ADD COLUMN     "subsector" TEXT,
ADD COLUMN     "successMetrics" TEXT,
ADD COLUMN     "techCategory" TEXT,
ADD COLUMN     "techMaturity" TEXT,
ADD COLUMN     "vendorTrackRecord" TEXT,
ADD COLUMN     "vendors" TEXT,
ADD COLUMN     "workforceSize" TEXT;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "baseScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "evidenceTypes" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "helpText" TEXT,
ADD COLUMN     "sectorTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subDomain" TEXT;

-- AlterTable
ALTER TABLE "support_tickets" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "category" "TicketCategory" NOT NULL,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "ticketNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "website" TEXT,
    "country" TEXT,
    "headquarters" TEXT,
    "sector" TEXT,
    "subsector" TEXT,
    "createdByOrgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verification" "PartnerVerification" NOT NULL DEFAULT 'UNVERIFIED',
    "metadata" JSONB,
    "aggregateScore" DOUBLE PRECISION,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_aliases" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "internalNotes" TEXT,
    "relationshipStatus" TEXT,
    "visibility" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cachedWebsite" TEXT,
    "cachedCountry" TEXT,
    "cachedSector" TEXT,

    CONSTRAINT "partner_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_contacts" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_ticket_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_tiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "priceUSD" DECIMAL(10,2),
    "baseFeeUSD" DECIMAL(10,2),
    "type" TEXT NOT NULL DEFAULT 'STANDARD',
    "pricePeriod" TEXT,
    "creditsIncluded" INTEGER NOT NULL DEFAULT 0,
    "minRespondents" INTEGER NOT NULL DEFAULT 1,
    "bestFor" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tier_features" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tier_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_bands" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "minCount" INTEGER NOT NULL,
    "maxCount" INTEGER,
    "pricePerUnit" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',

    CONSTRAINT "credit_bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_questions" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_options" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "form_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_pricing" (
    "id" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CREDIT_BUNDLE',
    "creditAmount" INTEGER NOT NULL,
    "priceUSD" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "typicalSeniority" TEXT,
    "domain" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_questions" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "assignedRoleId" TEXT,
    "assignedSeniority" TEXT,
    "evidenceRequirements" JSONB NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL,
    "aiConfidence" DOUBLE PRECISION,
    "aiRationale" TEXT,
    "customized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_invitations" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "roleId" TEXT,
    "seniority" TEXT,
    "userId" TEXT,
    "token" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedBy" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "verificationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "partners_legalName_idx" ON "partners"("legalName");

-- CreateIndex
CREATE INDEX "partners_sector_country_idx" ON "partners"("sector", "country");

-- CreateIndex
CREATE INDEX "partner_aliases_organizationId_idx" ON "partner_aliases"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "partner_aliases_partnerId_organizationId_key" ON "partner_aliases"("partnerId", "organizationId");

-- CreateIndex
CREATE INDEX "partner_contacts_email_idx" ON "partner_contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_tiers_name_key" ON "subscription_tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platform_config_key_key" ON "platform_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "form_options_category_value_key" ON "form_options"("category", "value");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_questions_assessmentId_questionId_key" ON "assessment_questions"("assessmentId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_invitations_token_key" ON "assessment_invitations"("token");

-- CreateIndex
CREATE INDEX "assessments_partnerGlobalId_idx" ON "assessments"("partnerGlobalId");

-- CreateIndex
CREATE INDEX "assessments_partnerAliasId_idx" ON "assessments"("partnerAliasId");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_ticketNumber_key" ON "support_tickets"("ticketNumber");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_aliases" ADD CONSTRAINT "partner_aliases_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_aliases" ADD CONSTRAINT "partner_aliases_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_contacts" ADD CONSTRAINT "partner_contacts_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_partnerGlobalId_fkey" FOREIGN KEY ("partnerGlobalId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_partnerAliasId_fkey" FOREIGN KEY ("partnerAliasId") REFERENCES "partner_aliases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_assessmentQuestionId_fkey" FOREIGN KEY ("assessmentQuestionId") REFERENCES "assessment_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_messages" ADD CONSTRAINT "support_ticket_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_messages" ADD CONSTRAINT "support_ticket_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_features" ADD CONSTRAINT "tier_features_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_bands" ADD CONSTRAINT "credit_bands_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assignedRoleId_fkey" FOREIGN KEY ("assignedRoleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_invitations" ADD CONSTRAINT "assessment_invitations_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_invitations" ADD CONSTRAINT "assessment_invitations_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_invitations" ADD CONSTRAINT "assessment_invitations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_invitations" ADD CONSTRAINT "assessment_invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "assessment_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
