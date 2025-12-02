/*
  Warnings:

  - Changed the type of `type` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RCTxType" AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'EXPIRE', 'ROLLOVER');

-- CreateEnum
CREATE TYPE "ECTxType" AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'EXPIRE', 'ROLLOVER', 'AUTO_RELOAD');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('RC_ONLY', 'EC_ONLY', 'COMBINED', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "EvidenceLayer" AS ENUM ('AE', 'VE', 'DSE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VALIDATED', 'FLAGGED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TrustEvidenceWeight" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TrustRoleCriticality" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TrustProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TrustEvidenceValidation" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "TrustRecommendation" AS ENUM ('PROCEED_CONFIDENTLY', 'PROCEED_WITH_CAUTION', 'REQUIRE_REMEDIATION', 'DO_NOT_PROCEED');

-- CreateEnum
CREATE TYPE "TrustFlagSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "trustDeploymentContext" JSONB,
ADD COLUMN     "trustPartnerTypeId" TEXT;

-- AlterTable
ALTER TABLE "form_options" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "userId" TEXT,
    "action" TEXT,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondent_credits" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "totalPurchased" INTEGER NOT NULL DEFAULT 0,
    "totalUsed" INTEGER NOT NULL DEFAULT 0,
    "totalAvailable" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "respondent_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondent_credit_transactions" (
    "id" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,
    "type" "RCTxType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "assessmentId" TEXT,
    "respondentId" TEXT,
    "packageId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respondent_credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_credits" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "totalPurchased" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalUsed" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAvailable" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "autoReloadEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoReloadThreshold" DECIMAL(10,2),
    "autoReloadAmount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "evidence_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_credit_transactions" (
    "id" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,
    "type" "ECTxType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "evidenceType" TEXT,
    "evidenceId" TEXT,
    "assessmentId" TEXT,
    "packageId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "type" "PackageType" NOT NULL,
    "rcAmount" INTEGER,
    "rcPrice" DECIMAL(10,2),
    "ecAmount" DECIMAL(10,2),
    "ecPrice" DECIMAL(10,2),
    "rcIncluded" INTEGER,
    "ecIncluded" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "description" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bestFor" TEXT,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "billingPeriod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ec_pricing" (
    "id" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "layer" "EvidenceLayer" NOT NULL,
    "costPerUnit" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "rationale" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ec_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enhanced_evidence" (
    "id" TEXT NOT NULL,
    "responseId" TEXT,
    "layer" "EvidenceLayer" NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "dataPayload" JSONB,
    "metadata" JSONB,
    "capturedAt" TIMESTAMP(3),
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationNotes" TEXT,
    "aiAnalysis" JSONB,
    "aiConfidence" DOUBLE PRECISION,
    "tamperFlags" JSONB,
    "ecCost" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enhanced_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_layers" (
    "id" TEXT NOT NULL,
    "layerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baselineWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "totalQuestions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_layers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_sub_dimensions" (
    "id" TEXT NOT NULL,
    "dimensionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "layerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_sub_dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_questions" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "subDimensionId" TEXT NOT NULL,
    "stakeholderTypes" TEXT[],
    "evidenceRequired" TEXT NOT NULL,
    "evidenceWeight" "TrustEvidenceWeight" NOT NULL,
    "weightInLayer" DOUBLE PRECISION NOT NULL,
    "scoringLogic" JSONB NOT NULL,
    "redFlags" JSONB[],
    "contextModifiers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_partner_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layerWeights" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_partner_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_required_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "layerCoverage" TEXT[],
    "criticality" "TrustRoleCriticality" NOT NULL,
    "assessmentFocus" TEXT NOT NULL,
    "partnerTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_required_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_partner_type_questions" (
    "id" TEXT NOT NULL,
    "partnerTypeId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "customWeight" DOUBLE PRECISION,

    CONSTRAINT "trust_partner_type_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_respondents" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_respondents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_question_responses" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "respondentId" TEXT NOT NULL,
    "textResponse" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_question_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_evidence_files" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT,
    "responseId" TEXT,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validationStatus" "TrustEvidenceValidation" NOT NULL DEFAULT 'PENDING',
    "validatedById" TEXT,
    "validatedAt" TIMESTAMP(3),
    "validationNotes" TEXT,
    "processingStatus" "TrustProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "documentType" TEXT,
    "extractedText" TEXT,
    "extractedData" JSONB,
    "qualityScore" DOUBLE PRECISION,
    "processingError" TEXT,

    CONSTRAINT "trust_evidence_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_layer_scores" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "layerId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "evidenceQuality" DOUBLE PRECISION NOT NULL,
    "subDimensionScores" JSONB NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_layer_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_scores" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "confidenceInterval" DOUBLE PRECISION NOT NULL,
    "recommendation" "TrustRecommendation" NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "executiveSummary" TEXT,
    "strengthsNarrative" TEXT,
    "weaknessesNarrative" TEXT,
    "recommendationsText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_red_flags" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "severity" "TrustFlagSeverity" NOT NULL,
    "category" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "layerId" TEXT,
    "questionId" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_red_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_sector_weights" (
    "id" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "layerWeights" JSONB NOT NULL,
    "rationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_sector_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_veto_criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "severity" "TrustFlagSeverity" NOT NULL,
    "message" TEXT NOT NULL,
    "overridesScore" BOOLEAN NOT NULL DEFAULT false,
    "sector" TEXT,
    "partnerType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_veto_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "system_logs_timestamp_idx" ON "system_logs"("timestamp");

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE UNIQUE INDEX "respondent_credits_organizationId_key" ON "respondent_credits"("organizationId");

-- CreateIndex
CREATE INDEX "respondent_credit_transactions_creditId_idx" ON "respondent_credit_transactions"("creditId");

-- CreateIndex
CREATE INDEX "respondent_credit_transactions_assessmentId_idx" ON "respondent_credit_transactions"("assessmentId");

-- CreateIndex
CREATE INDEX "respondent_credit_transactions_type_idx" ON "respondent_credit_transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_credits_organizationId_key" ON "evidence_credits"("organizationId");

-- CreateIndex
CREATE INDEX "evidence_credit_transactions_creditId_idx" ON "evidence_credit_transactions"("creditId");

-- CreateIndex
CREATE INDEX "evidence_credit_transactions_evidenceType_idx" ON "evidence_credit_transactions"("evidenceType");

-- CreateIndex
CREATE INDEX "evidence_credit_transactions_type_idx" ON "evidence_credit_transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "credit_packages_name_key" ON "credit_packages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ec_pricing_evidenceType_key" ON "ec_pricing"("evidenceType");

-- CreateIndex
CREATE INDEX "ec_pricing_layer_idx" ON "ec_pricing"("layer");

-- CreateIndex
CREATE INDEX "ec_pricing_isActive_idx" ON "ec_pricing"("isActive");

-- CreateIndex
CREATE INDEX "enhanced_evidence_layer_idx" ON "enhanced_evidence"("layer");

-- CreateIndex
CREATE INDEX "enhanced_evidence_type_idx" ON "enhanced_evidence"("type");

-- CreateIndex
CREATE INDEX "enhanced_evidence_verificationStatus_idx" ON "enhanced_evidence"("verificationStatus");

-- CreateIndex
CREATE INDEX "enhanced_evidence_uploadedBy_idx" ON "enhanced_evidence"("uploadedBy");

-- CreateIndex
CREATE UNIQUE INDEX "trust_layers_layerId_key" ON "trust_layers"("layerId");

-- CreateIndex
CREATE INDEX "trust_layers_layerId_idx" ON "trust_layers"("layerId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_sub_dimensions_dimensionId_key" ON "trust_sub_dimensions"("dimensionId");

-- CreateIndex
CREATE INDEX "trust_sub_dimensions_layerId_idx" ON "trust_sub_dimensions"("layerId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_questions_questionId_key" ON "trust_questions"("questionId");

-- CreateIndex
CREATE INDEX "trust_questions_subDimensionId_idx" ON "trust_questions"("subDimensionId");

-- CreateIndex
CREATE INDEX "trust_questions_questionId_idx" ON "trust_questions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_partner_types_name_key" ON "trust_partner_types"("name");

-- CreateIndex
CREATE INDEX "trust_required_roles_partnerTypeId_idx" ON "trust_required_roles"("partnerTypeId");

-- CreateIndex
CREATE INDEX "trust_partner_type_questions_partnerTypeId_idx" ON "trust_partner_type_questions"("partnerTypeId");

-- CreateIndex
CREATE INDEX "trust_partner_type_questions_questionId_idx" ON "trust_partner_type_questions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_partner_type_questions_partnerTypeId_questionId_key" ON "trust_partner_type_questions"("partnerTypeId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_respondents_accessToken_key" ON "trust_respondents"("accessToken");

-- CreateIndex
CREATE INDEX "trust_respondents_assessmentId_idx" ON "trust_respondents"("assessmentId");

-- CreateIndex
CREATE INDEX "trust_respondents_accessToken_idx" ON "trust_respondents"("accessToken");

-- CreateIndex
CREATE INDEX "trust_respondents_email_idx" ON "trust_respondents"("email");

-- CreateIndex
CREATE INDEX "trust_question_responses_assessmentId_idx" ON "trust_question_responses"("assessmentId");

-- CreateIndex
CREATE INDEX "trust_question_responses_questionId_idx" ON "trust_question_responses"("questionId");

-- CreateIndex
CREATE INDEX "trust_question_responses_respondentId_idx" ON "trust_question_responses"("respondentId");

-- CreateIndex
CREATE INDEX "trust_evidence_files_assessmentId_idx" ON "trust_evidence_files"("assessmentId");

-- CreateIndex
CREATE INDEX "trust_evidence_files_questionId_idx" ON "trust_evidence_files"("questionId");

-- CreateIndex
CREATE INDEX "trust_evidence_files_responseId_idx" ON "trust_evidence_files"("responseId");

-- CreateIndex
CREATE INDEX "trust_evidence_files_uploadedById_idx" ON "trust_evidence_files"("uploadedById");

-- CreateIndex
CREATE INDEX "trust_layer_scores_assessmentId_idx" ON "trust_layer_scores"("assessmentId");

-- CreateIndex
CREATE INDEX "trust_layer_scores_layerId_idx" ON "trust_layer_scores"("layerId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_layer_scores_assessmentId_layerId_key" ON "trust_layer_scores"("assessmentId", "layerId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_scores_assessmentId_key" ON "trust_scores"("assessmentId");

-- CreateIndex
CREATE INDEX "trust_red_flags_assessmentId_idx" ON "trust_red_flags"("assessmentId");

-- CreateIndex
CREATE INDEX "trust_red_flags_severity_idx" ON "trust_red_flags"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "trust_sector_weights_sector_key" ON "trust_sector_weights"("sector");

-- CreateIndex
CREATE INDEX "trust_veto_criteria_isActive_idx" ON "trust_veto_criteria"("isActive");

-- CreateIndex
CREATE INDEX "trust_veto_criteria_sector_idx" ON "trust_veto_criteria"("sector");

-- CreateIndex
CREATE INDEX "assessments_trustPartnerTypeId_idx" ON "assessments"("trustPartnerTypeId");

-- CreateIndex
CREATE INDEX "form_options_parentId_idx" ON "form_options"("parentId");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_trustPartnerTypeId_fkey" FOREIGN KEY ("trustPartnerTypeId") REFERENCES "trust_partner_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_options" ADD CONSTRAINT "form_options_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "form_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondent_credits" ADD CONSTRAINT "respondent_credits_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondent_credit_transactions" ADD CONSTRAINT "respondent_credit_transactions_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "respondent_credits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondent_credit_transactions" ADD CONSTRAINT "respondent_credit_transactions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondent_credit_transactions" ADD CONSTRAINT "respondent_credit_transactions_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondent_credit_transactions" ADD CONSTRAINT "respondent_credit_transactions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "credit_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_credits" ADD CONSTRAINT "evidence_credits_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_credit_transactions" ADD CONSTRAINT "evidence_credit_transactions_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "evidence_credits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_credit_transactions" ADD CONSTRAINT "evidence_credit_transactions_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "enhanced_evidence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_credit_transactions" ADD CONSTRAINT "evidence_credit_transactions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_credit_transactions" ADD CONSTRAINT "evidence_credit_transactions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "credit_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhanced_evidence" ADD CONSTRAINT "enhanced_evidence_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "assessment_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhanced_evidence" ADD CONSTRAINT "enhanced_evidence_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhanced_evidence" ADD CONSTRAINT "enhanced_evidence_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_sub_dimensions" ADD CONSTRAINT "trust_sub_dimensions_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "trust_layers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_questions" ADD CONSTRAINT "trust_questions_subDimensionId_fkey" FOREIGN KEY ("subDimensionId") REFERENCES "trust_sub_dimensions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_required_roles" ADD CONSTRAINT "trust_required_roles_partnerTypeId_fkey" FOREIGN KEY ("partnerTypeId") REFERENCES "trust_partner_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_partner_type_questions" ADD CONSTRAINT "trust_partner_type_questions_partnerTypeId_fkey" FOREIGN KEY ("partnerTypeId") REFERENCES "trust_partner_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_partner_type_questions" ADD CONSTRAINT "trust_partner_type_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "trust_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_respondents" ADD CONSTRAINT "trust_respondents_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_respondents" ADD CONSTRAINT "trust_respondents_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "trust_required_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_question_responses" ADD CONSTRAINT "trust_question_responses_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_question_responses" ADD CONSTRAINT "trust_question_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "trust_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_question_responses" ADD CONSTRAINT "trust_question_responses_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "trust_respondents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_evidence_files" ADD CONSTRAINT "trust_evidence_files_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_evidence_files" ADD CONSTRAINT "trust_evidence_files_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "trust_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_evidence_files" ADD CONSTRAINT "trust_evidence_files_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "trust_question_responses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_evidence_files" ADD CONSTRAINT "trust_evidence_files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_evidence_files" ADD CONSTRAINT "trust_evidence_files_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_layer_scores" ADD CONSTRAINT "trust_layer_scores_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_layer_scores" ADD CONSTRAINT "trust_layer_scores_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "trust_layers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_scores" ADD CONSTRAINT "trust_scores_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_red_flags" ADD CONSTRAINT "trust_red_flags_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
