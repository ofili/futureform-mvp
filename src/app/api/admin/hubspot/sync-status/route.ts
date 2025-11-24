import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/hubspot/sync-status
 * Returns HubSpot sync statistics and failed leads
 */
export async function GET(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get sync statistics
        const [totalLeads, syncedLeads, failedLeads, pendingLeads, lastSynced] = await Promise.all([
            prisma.marketingLead.count(),
            prisma.marketingLead.count({ where: { hubspotSynced: true } }),
            prisma.marketingLead.count({
                where: {
                    hubspotSynced: false,
                    hubspotSyncError: { not: null }
                }
            }),
            prisma.marketingLead.count({
                where: {
                    hubspotSynced: false,
                    hubspotSyncError: null
                }
            }),
            prisma.marketingLead.findFirst({
                where: { hubspotSynced: true },
                orderBy: { hubspotSyncedAt: 'desc' },
                select: { hubspotSyncedAt: true }
            })
        ]);

        // Get failed leads for display
        const failedLeadsList = await prisma.marketingLead.findMany({
            where: {
                hubspotSynced: false,
                hubspotSyncError: { not: null }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                organization: true,
                hubspotSyncError: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 20, // Limit to 20 most recent failures
        });

        return NextResponse.json({
            stats: {
                totalLeads,
                syncedLeads,
                failedLeads,
                pendingLeads,
                lastSyncedAt: lastSynced?.hubspotSyncedAt,
            },
            failedLeads: failedLeadsList,
        });

    } catch (error) {
        console.error('Error fetching HubSpot sync status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sync status' },
            { status: 500 }
        );
    }
}
