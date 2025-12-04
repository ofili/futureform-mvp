/*
  Warnings:

  - The `type` column on the `credit_pricing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "credit_pricing" ADD COLUMN     "ecAmount" INTEGER,
ADD COLUMN     "priceEUR" DECIMAL(10,2),
ADD COLUMN     "priceGBP" DECIMAL(10,2),
ADD COLUMN     "priceNGN" DECIMAL(10,2),
ADD COLUMN     "rcAmount" INTEGER,
ADD COLUMN     "tierId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "PackageType" NOT NULL DEFAULT 'RC_ONLY',
ALTER COLUMN "creditAmount" DROP NOT NULL;

-- CreateTable
CREATE TABLE "currency_exchange_rates" (
    "id" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" DECIMAL(10,4) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currency_exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currency_exchange_rates_fromCurrency_toCurrency_key" ON "currency_exchange_rates"("fromCurrency", "toCurrency");

-- AddForeignKey
ALTER TABLE "credit_pricing" ADD CONSTRAINT "credit_pricing_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currency_exchange_rates" ADD CONSTRAINT "currency_exchange_rates_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
