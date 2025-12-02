import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assessmentService } from '@/services';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      projectId: searchParams.get('projectId') || undefined,
      status: searchParams.get('status') as any,
    };

    // Service handles authorization and data fetching
    const assessments = await assessmentService.list(userId, filters);

    return NextResponse.json({ data: assessments });
  } catch (error) {
    console.error('Get assessments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

/**
 * POST /api/v1/assessments
 * Rate Limited: 30 requests per minute
 */
export async function POST(request: NextRequest) {
  // Apply moderate rate limiting for assessment creation
  const rateLimitResult = await rateLimit(request, RateLimitPresets.api);

  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Service handles validation, authorization, and credit consumption
    const assessment = await assessmentService.create(body, userId);

    return NextResponse.json(assessment, { status: 201 });
  } catch (error: any) {
    console.error('Create assessment error:', error);

    // Handle specific errors
    if (error.message?.includes('Unauthorized')) {
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