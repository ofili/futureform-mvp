import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assessmentService } from '@/services/assessments/assessment.service';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      projectId: searchParams.get('projectId') || undefined,
      status: searchParams.get('status') as any,
    };

    const assessments = await assessmentService.list(session.user.id, filters);

    return NextResponse.json({ data: assessments });
  } catch (error) {
    logger.error('Get assessments error', error as Error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

/**
 * POST /api/v1/assessments
 * Rate Limited: 30 requests per minute
 */
export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, RateLimitPresets.api);

  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const assessment = await assessmentService.create(body, session.user.id);

    return NextResponse.json(assessment, { status: 201 });
  } catch (error: any) {
    logger.error('Create assessment error', error as Error);

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message?.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.includes('credits')) {
      return NextResponse.json({ error: error.message }, { status: 402 });
    }

    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}