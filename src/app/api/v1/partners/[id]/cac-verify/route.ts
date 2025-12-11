import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { monoService } from '@/services/mono/mono.service';
import { logger } from '@/lib/logger';
import { PartnerVerification } from '@prisma/client';

// POST /api/v1/partners/[id]/cac-verify - Verify partner with CAC
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: partnerAliasId } = await params;

        // Fetch partner alias and global partner
        const partnerAlias = await prisma.partnerAlias.findUnique({
            where: { id: partnerAliasId },
            include: {
                partner: true,
                organization: {
                    include: {
                        members: {
                            where: {
                                userId: session.user.id,
                                deletedAt: null,
                            },
                        },
                    },
                },
            },
        });

        if (!partnerAlias) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        if (partnerAlias.organization.members.length === 0) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const rcNumber = partnerAlias.partner.rcNumber || partnerAlias.partner.cacNumber;

        if (!rcNumber) {
            return NextResponse.json({ error: 'No RC Number on record' }, { status: 400 });
        }

        // Check if Mono is configured
        if (!monoService.isConfigured()) {
            // Return mock verification for dev
            const mockData = {
                rcNumber,
                companyName: partnerAlias.partner.legalName,
                companyType: 'Limited Liability Company',
                registeredAddress: 'Lagos, Nigeria',
                incorporationDate: '2020-01-15',
                status: 'ACTIVE',
                directors: [
                    { name: 'Director One', position: 'Managing Director' },
                ],
            };

            await prisma.partner.update({
                where: { id: partnerAlias.partner.id },
                data: {
                    cacVerifiedName: mockData.companyName,
                    cacVerifiedAt: new Date(),
                    cacVerificationData: mockData,
                    companyType: mockData.companyType,
                    registeredAddress: mockData.registeredAddress,
                    incorporationDate: new Date(mockData.incorporationDate),
                    directors: mockData.directors,
                    verification: 'FUTUREFORM_VERIFIED',
                },
            });

            return NextResponse.json({
                message: 'Mock verification complete (Mono not configured)',
                data: mockData,
            });
        }

        // Verify via Mono
        const companyData = await monoService.getCompanyDetails(rcNumber);

        // Update global partner with CAC data
        await prisma.partner.update({
            where: { id: partnerAlias.partner.id },
            data: {
                cacVerifiedName: companyData.companyName,
                cacVerifiedAt: new Date(),
                cacVerificationData: companyData as any,
                companyType: companyData.companyType,
                registeredAddress: companyData.registeredAddress,
                incorporationDate: companyData.incorporationDate
                    ? new Date(companyData.incorporationDate)
                    : null,
                directors: companyData.directors || [],
                verification: 'FUTUREFORM_VERIFIED',
            },
        });

        logger.info('CAC verification complete', {
            service: 'PartnerAPI',
            method: 'verifyCAC',
            partnerAliasId,
            partnerId: partnerAlias.partner.id,
            rcNumber,
        });

        return NextResponse.json({
            message: 'CAC verification complete',
            data: companyData,
        });
    } catch (error: any) {
        logger.error('CAC verification failed', error, { service: 'PartnerAPI', method: 'verifyCAC' });
        return NextResponse.json(
            { error: error.message || 'CAC verification failed' },
            { status: 400 }
        );
    }
}
