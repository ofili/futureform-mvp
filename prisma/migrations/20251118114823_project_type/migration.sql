/*
  Warnings:

  - The values [STANDALONE,MULTI_PARTNER] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('Pre-investment due diligence', 'Vendor selection / procurement', 'Portfolio monitoring (existing partners)', 'Governance audit', 'Multi-stakeholder alignment');
ALTER TABLE "public"."projects" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "projects" ALTER COLUMN "type" TYPE "ProjectType_new" USING ("type"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "public"."ProjectType_old";
COMMIT;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "type" DROP DEFAULT;
