-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('TIER_UPGRADE', 'RC_PURCHASE', 'EC_PURCHASE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "PaymentStatus" NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'flutterwave',
    "transactionRef" TEXT NOT NULL,
    "flutterwaveTxId" INTEGER,
    "flutterwaveTxRef" TEXT,
    "metadata" JSONB,
    "tierId" TEXT,
    "packageId" TEXT,
    "paymentLink" TEXT,
    "redirectUrl" TEXT,
    "webhookReceived" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_transactionRef_key" ON "payment_transactions"("transactionRef");

-- CreateIndex
CREATE INDEX "payment_transactions_organizationId_idx" ON "payment_transactions"("organizationId");

-- CreateIndex
CREATE INDEX "payment_transactions_userId_idx" ON "payment_transactions"("userId");

-- CreateIndex
CREATE INDEX "payment_transactions_transactionRef_idx" ON "payment_transactions"("transactionRef");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_createdAt_idx" ON "payment_transactions"("createdAt");

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "credit_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
