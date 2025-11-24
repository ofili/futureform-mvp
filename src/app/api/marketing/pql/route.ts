import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { createHubSpotContact } from '@/lib/hubspot';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

/**
 * POST /api/marketing/pql
 * Receives micro-PQL payload from the framework download page.
 * Stores the lead in the database, syncs to HubSpot, and returns a download token.
 * 
 * Rate Limited: 100 requests per minute per IP
 */
export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RateLimitPresets.public);

    if (!rateLimitResult.success) {
        return rateLimitResult.response;
    }

    try {
        const payload = await request.json();
        const { firstName, lastName, email, organization, sector, country, source, timestamp } = payload;

        // Validate required fields
        if (!firstName || !lastName || !email || !organization) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Generate a secure download token
        const downloadToken = crypto.randomBytes(32).toString('hex');

        // Store the lead in the database
        const lead = await prisma.marketingLead.create({
            data: {
                firstName,
                lastName,
                email,
                organization,
                sector: sector || null,
                country: country || null,
                source: source || 'framework_download',
                downloadToken,
                status: 'NEW',
                metadata: {
                    timestamp,
                    userAgent: request.headers.get('user-agent'),
                    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
                }
            }
        });

        console.log('Marketing PQL created:', {
            id: lead.id,
            email: lead.email,
            source: lead.source,
            token: downloadToken.substring(0, 8) + '...' // Log partial token for debugging
        });

        // Sync to HubSpot (non-blocking - don't fail if HubSpot sync fails)
        try {
            const hubspotResult = await createHubSpotContact({
                firstName,
                lastName,
                email,
                organization,
                sector: sector || undefined,
                country: country || undefined,
                source: source || 'framework_download',
            });

            // Update lead with HubSpot sync status
            await prisma.marketingLead.update({
                where: { id: lead.id },
                data: {
                    hubspotSynced: hubspotResult.success,
                    hubspotContactId: hubspotResult.contactId || null,
                    hubspotSyncedAt: hubspotResult.success ? new Date() : null,
                    hubspotSyncError: hubspotResult.error || null,
                }
            });

            if (hubspotResult.success) {
                console.log('HubSpot sync successful:', {
                    leadId: lead.id,
                    contactId: hubspotResult.contactId,
                    isUpdate: hubspotResult.isUpdate,
                });
            } else {
                console.warn('HubSpot sync failed (non-critical):', {
                    leadId: lead.id,
                    error: hubspotResult.error,
                });
            }
        } catch (hubspotError) {
            // Log HubSpot sync error but don't fail the request
            console.error('HubSpot sync error (non-critical):', hubspotError);

            // Update lead with error status
            await prisma.marketingLead.update({
                where: { id: lead.id },
                data: {
                    hubspotSynced: false,
                    hubspotSyncError: hubspotError instanceof Error ? hubspotError.message : 'Unknown error',
                }
            });
        }

        return NextResponse.json({
            message: 'PQL received',
            downloadToken,
            leadId: lead.id
        }, { status: 200 });
    } catch (error) {
        console.error('Error handling PQL:', error);

        // Check for unique constraint violation (duplicate email)
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            // Generate a new token for existing lead
            const downloadToken = crypto.randomBytes(32).toString('hex');
            return NextResponse.json({
                message: 'Lead already exists',
                downloadToken
            }, { status: 200 });
        }

        return NextResponse.json({
            error: 'Failed to process request'
        }, { status: 500 });
    }
}
