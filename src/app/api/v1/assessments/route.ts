import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { CreditService } from '@/lib/services/creditService';
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

    const assessments = await prisma.assessment.findMany({
      where: {
        OR: [
          { partnerId: userId }, // As partner
          { project: { createdById: userId } }, // As project owner
          { project: { teamMembers: { some: { userId } } } } // As team member
        ]
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        scores: true,
        redFlags: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(assessments);
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
    const { projectId, partnerName, partnerEmail } = body;

    if (!projectId || !partnerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch project to get organizationId
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { organizationId: true }
    });

    if (!project || !project.organizationId) {
      return NextResponse.json({ error: 'Project not found or not associated with an organization' }, { status: 404 });
    }

    const organizationId = project.organizationId;

    // 1. Check for sufficient credits
    const creditCheck = await CreditService.hasSufficientCredits(organizationId);
    if (!creditCheck.hasCredits) {
      return NextResponse.json(
        { error: creditCheck.message || 'Insufficient credits' },
        { status: 402 } // Payment Required
      );
    }

    // 2. Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        projectId,
        partnerName,
        partnerId: userId, // For now, assigning to creator for testing. In real flow, this would be the invited partner.
        partnerType: 'VENDOR', // Default
        status: 'PENDING',
        token: crypto.randomUUID(),
      }
    });

    // 3. Deduct credit
    try {
      await CreditService.useCreditForAssessment(organizationId, userId, assessment.id);
    } catch (creditError) {
      // Rollback: Delete the created assessment if credit deduction fails
      console.error('Credit deduction failed, rolling back assessment:', creditError);
      await prisma.assessment.delete({ where: { id: assessment.id } });
      return NextResponse.json(
        { error: 'Failed to process credit deduction. Assessment cancelled.' },
        { status: 500 }
      );
    }

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}