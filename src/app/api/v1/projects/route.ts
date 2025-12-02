import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { projectService } from '@/services';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

async function getAuthenticatedUser() {
  // Try NextAuth session first (for server-side requests)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
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

    // Service handles filtering and authorization
    const projects = await projectService.list(userId, filters);

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
  }
}

/**
 * POST /api/v1/projects
 * Rate Limited: 30 requests per minute
 */
export async function POST(request: NextRequest) {
  // Apply moderate rate limiting for project creation
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

    // Validate required fields
    if (!body.name || !body.type || !body.sector || !body.region) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, sector, region' },
        { status: 400 }
      );
    }

    // Service handles creation and authorization
    const project = await projectService.create(body, userId);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}