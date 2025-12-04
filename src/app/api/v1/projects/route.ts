import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { projectService } from '@/services/projects/project.service';
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
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      sector: searchParams.get('sector') || undefined,
      region: searchParams.get('region') || undefined,
      budgetRange: searchParams.get('budget') || undefined,
    };

    const projects = await projectService.list(session.user.id, filters);

    return NextResponse.json({ data: projects });
  } catch (error) {
    logger.error('Get projects error', error as Error);
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
  }
}

/**
 * POST /api/v1/projects
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

    // Validate required fields
    if (!body.name || !body.type || !body.sector || !body.region) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, sector, region' },
        { status: 400 }
      );
    }

    const project = await projectService.create(body, session.user.id);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    logger.error('Create project error', error as Error);

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}