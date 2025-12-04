-- AlterTable
ALTER TABLE "credit_packages" ADD COLUMN     "tierId" TEXT;

-- AddForeignKey
ALTER TABLE "credit_packages" ADD CONSTRAINT "credit_packages_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
