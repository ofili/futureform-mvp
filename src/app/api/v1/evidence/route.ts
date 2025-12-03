import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { EvidenceLayer, VerificationStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = req.nextUrl.searchParams.get('organizationId');
    const layer = req.nextUrl.searchParams.get('layer') as EvidenceLayer | undefined;
    const status = req.nextUrl.searchParams.get('status') as VerificationStatus | undefined;
    const limit = req.nextUrl.searchParams.get('limit');
    const offset = req.nextUrl.searchParams.get('offset');

    if (!organizationId) {
      // If no org ID provided, try to get from user's org (assuming single org for now)
      // In real app, we'd check session
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Authorization check: verify user belongs to the requested organization
    const userOrgs = await prisma.organizationMember.findMany({
      where: { userId: session.user.id, deletedAt: null },
      select: { organizationId: true }
    });

    const hasAccess = session.user.role === 'ADMIN' ||
      userOrgs.some(org => org.organizationId === organizationId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this organization' },
        { status: 403 }
      );
    }

    const evidence = await prisma.enhancedEvidence.findMany({
      where: {
        uploader: {
          organizations: {
            some: {
              organizationId: organizationId,
            },
          },
        },
        ...(layer && { layer }),
        ...(status && { verificationStatus: status }),
      },
      include: {
        uploader: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : 50,
      skip: offset ? parseInt(offset) : 0,
    });

    return NextResponse.json(evidence);
  } catch (error) {
    logger.error('Failed to list evidence', error as Error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
