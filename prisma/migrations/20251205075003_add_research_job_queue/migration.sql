-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterEnum
ALTER TYPE "AssessmentStatus" ADD VALUE 'DRAFT';

-- CreateTable
CREATE TABLE "research_jobs" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "rcNumber" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "research_jobs" ADD CONSTRAINT "research_jobs_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
