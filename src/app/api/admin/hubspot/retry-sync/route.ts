import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createHubSpotContact } from '@/lib/hubspot';

/**
 * POST /api/admin/hubspot/retry-sync
 * Retries HubSpot sync for a specific lead
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { leadId } = await request.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
        }

        // Get the lead
        const lead = await prisma.marketingLead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Retry HubSpot sync
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
            where: { id: leadId },
            data: {
                hubspotSynced: hubspotResult.success,
                hubspotContactId: hubspotResult.contactId || null,
                hubspotSyncedAt: hubspotResult.success ? new Date() : null,
                hubspotSyncError: hubspotResult.error || null,
            },
        });

        return NextResponse.json({
            success: hubspotResult.success,
            message: hubspotResult.success
                ? 'Lead synced successfully'
                : `Sync failed: ${hubspotResult.error}`,
        });

    } catch (error) {
        console.error('Error retrying HubSpot sync:', error);
        return NextResponse.json(
            { error: 'Failed to retry sync' },
            { status: 500 }
        );
    }
}
