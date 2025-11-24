import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Test Credit table
        const creditCount = await prisma.credit.count();
        console.log(`✓ Credit table exists (${creditCount} records)`);

        // Test CreditTransaction table
        const transactionCount = await prisma.creditTransaction.count();
        console.log(`✓ CreditTransaction table exists (${transactionCount} records)`);

        // Test SubscriptionTier table
        const tierCount = await prisma.subscriptionTier.count();
        console.log(`✓ SubscriptionTier table exists (${tierCount} records)`);

        // Test CreditPricing table
        const pricingCount = await prisma.creditPricing.count();
        console.log(`✓ CreditPricing table exists (${pricingCount} records)`);

        console.log('\nAll required tables exist!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
