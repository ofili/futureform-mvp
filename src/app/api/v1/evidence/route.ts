import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/services/evidence/evidence.service';
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
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    try {
      const evidence = await evidenceService.listEvidenceWithAuth(
        session.user.id,
        session.user.role,
        organizationId,
        {
          layer,
          status,
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined,
        }
      );

      return NextResponse.json(evidence);
    } catch (error: any) {
      if (error.message.includes('Forbidden')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      throw error;
    }
  } catch (error) {
    logger.error('Failed to list evidence', error as Error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
