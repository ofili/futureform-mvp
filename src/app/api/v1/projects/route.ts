import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
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

    // Build Prisma filters
    const filters: any = {
      teamMembers: {
        some: { userId }
      }
    };

    // Optional filters
    if (searchParams.get('search')) {
      const search = searchParams.get('search')!;
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type');
    }
    if (searchParams.get('sector')) {
      filters.sector = searchParams.get('sector');
    }
    if (searchParams.get('region')) {
      filters.region = searchParams.get('region');
    }
    if (searchParams.get('budget')) {
      filters.budgetRange = searchParams.get('budget');
    }

    const projects = await prisma.project.findMany({
      where: filters,
      include: {
        assessments: {
          select: { id: true, status: true }
        }
      }
    });

    return NextResponse.json(projects);
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

    // Create project
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        type: body.type,
        sector: body.sector,
        region: body.region,
        status: body.status || 'PLANNING',
        budgetRange: body.budgetRange,
        maturityLevel: body.maturityLevel,
        timeline: body.timeline,
        objectives: body.objectives,
        stakeholders: body.stakeholders,
        createdBy: {
          connect: { id: userId }
        },
        teamMembers: {
          create: {
            userId: userId,
            invitedBy: userId,
            role: 'PROJECT_ADMIN',
            invitationToken: randomUUID(),
            invitationStatus: 'ACCEPTED',
            invitationAcceptedAt: new Date()
          }
        }
      },
      include: {
        assessments: {
          select: { id: true, status: true }
        }
      }
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}