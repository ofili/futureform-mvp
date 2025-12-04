-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "cacNumber" TEXT,
ADD COLUMN     "cacVerificationData" JSONB,
ADD COLUMN     "cacVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "cacVerifiedName" TEXT,
ADD COLUMN     "companyType" TEXT,
ADD COLUMN     "directors" JSONB,
ADD COLUMN     "incorporationDate" TIMESTAMP(3),
ADD COLUMN     "rcNumber" TEXT,
ADD COLUMN     "registeredAddress" TEXT;

-- CreateIndex
CREATE INDEX "partners_cacNumber_idx" ON "partners"("cacNumber");

-- CreateIndex
CREATE INDEX "partners_rcNumber_idx" ON "partners"("rcNumber");
