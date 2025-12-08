import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { assessmentService } from '@/services/assessments/assessment.service';
import { logger } from '@/lib/logger';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 });
        }

        try {
            await assessmentService.submitResponses(id, session.user.id, responses);
            return NextResponse.json({ success: true });
        } catch (error: any) {
            if (error.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }
            if (error.message.includes('Assessment not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            throw error;
        }
    } catch (error) {
        logger.error('Submit responses error', error as Error);
        return NextResponse.json({ error: 'Failed to submit responses' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Fetch finalized responses
        const responses = await prisma.assessmentResponse.findMany({
            where: {
                assessmentId: id,
            },
            select: {
                id: true, // Need ID for clarifying
                questionId: true,
                response: true,
                evidenceFiles: true,
                updatedAt: true,
                validationStatus: true,
                clarificationRequests: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Only get the latest request
                    select: {
                        id: true,
                        clarificationMessage: true,
                        responseDeadline: true,
                        reviewerDecision: true
                    }
                }
            }
        });

        // Fetch drafts
        const drafts = await prisma.assessmentDraft.findMany({
            where: {
                assessmentId: id,
            },
            select: {
                questionId: true,
                draftData: true,
                lastSaved: true
            }
        });

        // Merge logic
        const mergedMap = new Map();

        // 1. Populate with finalized responses
        responses.forEach(r => {
            mergedMap.set(r.questionId, {
                responseId: r.id, // return the response Id for clarification
                questionId: r.questionId,
                response: r.response,
                files: r.evidenceFiles ? JSON.parse(JSON.stringify(r.evidenceFiles)) : [],
                isDraft: false,
                timestamp: new Date(r.updatedAt).getTime(),
                validationStatus: r.validationStatus,
                latestClarification: r.clarificationRequests[0] || null
            });
        });

        // 2. Overlay drafts if newer
        drafts.forEach(d => {
            const existing = mergedMap.get(d.questionId);
            const draftTime = new Date(d.lastSaved).getTime();

            if (!existing || draftTime > existing.timestamp) {
                try {
                    const parsedDraft = JSON.parse(d.draftData);
                    // Preserve status from existing submitted response if any
                    const status = existing ? existing.validationStatus : 'DRAFT';
                    const clarification = existing ? existing.latestClarification : null;
                    const responseId = existing ? existing.responseId : null;

                    mergedMap.set(d.questionId, {
                        responseId,
                        questionId: d.questionId,
                        ...parsedDraft,
                        isDraft: true,
                        timestamp: draftTime,
                        validationStatus: status,
                        latestClarification: clarification
                    });
                } catch (e) {
                    console.error('Error parsing draft data', e);
                }
            }
        });

        return NextResponse.json({
            success: true,
            responses: Array.from(mergedMap.values())
        });

    } catch (error) {
        logger.error('Get responses error', error as Error);
        return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
    }
}
