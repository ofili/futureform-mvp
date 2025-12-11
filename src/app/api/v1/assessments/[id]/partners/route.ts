import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: assessmentId } = await params;
        const body = await request.json();
        const { partners } = body;

        if (!partners || !Array.isArray(partners) || partners.length === 0) {
            return NextResponse.json({ error: 'No partners provided' }, { status: 400 });
        }

        // Verify Assessment exists and user has access
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: { project: true }
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        // TODO: Check if user has permission to edit this assessment (Owner or Org Member)

        const createdPartners = [];
        const errors = [];

        for (const p of partners) {
            try {
                // Generate secure token
                const token = crypto.randomBytes(32).toString('hex');

                // Check if already invited? (Optional logic)

                const assessmentPartner = await prisma.assessmentPartner.create({
                    data: {
                        assessmentId,
                        partnerId: p.partnerGlobalId,
                        partnerAliasId: p.partnerAliasId || null,
                        adminName: p.adminName,
                        adminEmail: p.adminEmail,
                        invitationToken: token,
                        invitationStatus: 'PENDING',
                        status: 'ACTIVE'
                    }
                });

                // Send Invitation Email
                // In a real implementation, call emailService here.
                // For now, we assume the email service picks up pending invitations or we log it.
                logger.info(`AssessmentPartner created: ${assessmentPartner.id}. Token: ${token}`);

                createdPartners.push(assessmentPartner);

            } catch (err: any) {
                logger.error(`Failed to invite partner ${p.partnerName}`, err);
                errors.push({ partner: p.partnerName, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            invited: createdPartners.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        logger.error('Error in inviting partners', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
