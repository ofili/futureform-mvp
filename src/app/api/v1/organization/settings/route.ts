import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organization = await prisma.organization.findUnique({
            where: { id: session.user.organizationId },
            include: {
                tier: true
            }
        });

        if (!organization) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json(organization);
    } catch (error) {
        console.error('Get organization settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only ORG_ADMIN (OrganizationRole.ADMIN) or OWNER or Global ADMIN can update settings
        const isGlobalAdmin = session.user.role === 'ADMIN';
        const isOrgAdmin = ['ADMIN', 'OWNER'].includes(session.user.organizationRole || '');

        if (!isGlobalAdmin && !isOrgAdmin) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const body = await req.json();
        const {
            name,
            type,
            sectorFocus,
            region,
            country,
            description,
            website,
            relationshipStage,
            source,
            referralSource,
            pilotAgreementSigned,
            caseStudyApproval
        } = body;

        const updatedOrg = await prisma.organization.update({
            where: { id: session.user.organizationId },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(sectorFocus !== undefined && { sectorFocus }),
                ...(region && { region }),
                ...(country !== undefined && { country }),
                ...(description !== undefined && { description }),
                ...(website !== undefined && { website }),
                ...(relationshipStage && { relationshipStage }),
                ...(source !== undefined && { source }),
                ...(referralSource !== undefined && { referralSource }),
                ...(pilotAgreementSigned !== undefined && { pilotAgreementSigned }),
                ...(caseStudyApproval !== undefined && { caseStudyApproval })
            },
            include: {
                tier: true
            }
        });

        return NextResponse.json(updatedOrg);
    } catch (error) {
        console.error('Update organization settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
