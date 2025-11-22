/*
  Warnings:

  - The `status` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DeclineReasonCategory" AS ENUM ('NOT_INTERESTED', 'TIMELINE_ISSUE', 'ALREADY_PARTNERED', 'PROCESS_COMPLEX', 'INFO_CONCERNS', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationFrequency" AS ENUM ('REALTIME', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATED', 'CANCELLED', 'ARCHIVED', 'RESTORED', 'DELETED');

-- AlterEnum
ALTER TYPE "CreditType" ADD VALUE 'EXPIRE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'ORG_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'PROJECT_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'REVIEWER';
ALTER TYPE "UserRole" ADD VALUE 'DOMAIN_EXPERT';
ALTER TYPE "UserRole" ADD VALUE 'OBSERVER';

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING';

-- DropTable
DROP TABLE "notifications";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL DEFAULT 'MEMBER',
    "invitedBy" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_profiles" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "domainScores" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_declines" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "declinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "declineReasonCategory" "DeclineReasonCategory" NOT NULL,
    "declineReasonText" TEXT,
    "contactAttempted" BOOLEAN NOT NULL DEFAULT false,
    "contactAttemptedAt" TIMESTAMP(3),
    "reInvited" BOOLEAN NOT NULL DEFAULT false,
    "reInvitedAt" TIMESTAMP(3),
    "newAssessmentId" TEXT,

    CONSTRAINT "assessment_declines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_audit_log" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "performedBy" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_transactions" (
    "id" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CreditType" NOT NULL,
    "creditsChange" INTEGER NOT NULL,
    "assessmentId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailAssessmentSubmitted" BOOLEAN NOT NULL DEFAULT true,
    "emailClarificationResponse" BOOLEAN NOT NULL DEFAULT true,
    "emailPartnerStarted" BOOLEAN NOT NULL DEFAULT false,
    "emailTeamJoined" BOOLEAN NOT NULL DEFAULT true,
    "emailTeamMention" BOOLEAN NOT NULL DEFAULT true,
    "emailTeamActivity" BOOLEAN NOT NULL DEFAULT false,
    "emailDeadlineReminder" BOOLEAN NOT NULL DEFAULT true,
    "emailCreditLow" BOOLEAN NOT NULL DEFAULT true,
    "emailCreditExpiring" BOOLEAN NOT NULL DEFAULT true,
    "emailProfileGenerated" BOOLEAN NOT NULL DEFAULT true,
    "emailExportReady" BOOLEAN NOT NULL DEFAULT true,
    "emailPaymentSuccess" BOOLEAN NOT NULL DEFAULT true,
    "emailPaymentFailed" BOOLEAN NOT NULL DEFAULT true,
    "emailSecurityAlways" BOOLEAN NOT NULL DEFAULT true,
    "emailFrequency" "NotificationFrequency" NOT NULL DEFAULT 'REALTIME',
    "digestTime" TEXT DEFAULT '09:00:00',
    "inappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inappSound" BOOLEAN NOT NULL DEFAULT true,
    "inappDesktopPush" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_queue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationType" TEXT NOT NULL,
    "notificationData" JSONB NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "scheduledFor" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_onboarding_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourStarted" BOOLEAN NOT NULL DEFAULT false,
    "tourCompleted" BOOLEAN NOT NULL DEFAULT false,
    "tourStepCompleted" INTEGER NOT NULL DEFAULT 0,
    "tourDismissed" BOOLEAN NOT NULL DEFAULT false,
    "checklistCreditsPurchased" BOOLEAN NOT NULL DEFAULT false,
    "checklistProjectCreated" BOOLEAN NOT NULL DEFAULT false,
    "checklistPartnerInvited" BOOLEAN NOT NULL DEFAULT false,
    "checklistProfileGenerated" BOOLEAN NOT NULL DEFAULT false,
    "tooltipNewAssessmentShown" BOOLEAN NOT NULL DEFAULT false,
    "tooltipTrustScoreShown" BOOLEAN NOT NULL DEFAULT false,
    "tooltipComparisonShown" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_onboarding_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_tiers" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "savings" TEXT,
    "perCredit" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_invitations_token_key" ON "organization_invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "trust_profiles_assessmentId_key" ON "trust_profiles"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_declines_assessmentId_key" ON "assessment_declines"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_preferences_userId_key" ON "user_notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_onboarding_progress_userId_key" ON "user_onboarding_progress"("userId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_action_idx" ON "admin_audit_logs"("action");

-- CreateIndex
CREATE INDEX "admin_audit_logs_resource_idx" ON "admin_audit_logs"("resource");

-- CreateIndex
CREATE INDEX "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "pricing_tiers_currency_idx" ON "pricing_tiers"("currency");

-- CreateIndex
CREATE INDEX "pricing_tiers_active_idx" ON "pricing_tiers"("active");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_tiers_currency_credits_key" ON "pricing_tiers"("currency", "credits");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_profiles" ADD CONSTRAINT "trust_profiles_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_declines" ADD CONSTRAINT "assessment_declines_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_declines" ADD CONSTRAINT "assessment_declines_newAssessmentId_fkey" FOREIGN KEY ("newAssessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_audit_log" ADD CONSTRAINT "assessment_audit_log_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_audit_log" ADD CONSTRAINT "assessment_audit_log_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_queue" ADD CONSTRAINT "notification_queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_onboarding_progress" ADD CONSTRAINT "user_onboarding_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
