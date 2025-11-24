import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createHubSpotContact } from '@/lib/hubspot';

/**
 * POST /api/admin/hubspot/bulk-retry
 * Retries HubSpot sync for all failed leads
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all failed leads
        const failedLeads = await prisma.marketingLead.findMany({
            where: {
                hubspotSynced: false,
                hubspotSyncError: { not: null },
            },
            take: 50, // Limit to 50 to avoid overwhelming HubSpot API
        });

        const results = {
            total: failedLeads.length,
            succeeded: 0,
            failed: 0,
        };

        // Retry each lead with a small delay to avoid rate limiting
        for (const lead of failedLeads) {
            try {
                const hubspotResult = await createHubSpotContact({
                    firstName: lead.firstName,
                    lastName: lead.lastName,
                    email: lead.email,
                    organization: lead.organization,
                    sector: lead.sector || undefined,
                    country: lead.country || undefined,
                    source: lead.source,
                });

                // Update lead with sync result
                await prisma.marketingLead.update({
                    where: { id: lead.id },
                    data: {
                        hubspotSynced: hubspotResult.success,
                        hubspotContactId: hubspotResult.contactId || null,
                        hubspotSyncedAt: hubspotResult.success ? new Date() : null,
                        hubspotSyncError: hubspotResult.error || null,
                    },
                });

                if (hubspotResult.success) {
                    results.succeeded++;
                } else {
                    results.failed++;
                }

                // Small delay to avoid rate limiting (100ms between requests)
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`Error retrying sync for lead ${lead.id}:`, error);
                results.failed++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Bulk retry completed: ${results.succeeded} succeeded, ${results.failed} failed`,
            results,
        });

    } catch (error) {
        console.error('Error in bulk retry:', error);
        return NextResponse.json(
            { error: 'Failed to perform bulk retry' },
            { status: 500 }
        );
    }
}
