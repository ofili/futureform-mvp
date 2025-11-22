import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function getUserFromToken(request: NextRequest) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

// GET: Fetch all clarification requests for an assessment
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = getUserFromToken(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const requests = await prisma.clarificationRequest.findMany({
            where: {
                assessmentResponse: {
                    assessmentId: id
                }
            },
            include: {
                reviewer: {
                    select: { firstName: true, lastName: true }
                },
                assessmentResponse: {
                    select: { questionId: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Get clarification requests error:', error);
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}

// POST: Create a new clarification request (Reviewer)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserFromToken(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { responseId, message, deadline } = body;

        if (!responseId || !message || !deadline) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const clarification = await prisma.clarificationRequest.create({
            data: {
                assessmentResponseId: responseId,
                reviewerUserId: userId,
                clarificationMessage: message,
                responseDeadline: new Date(deadline),
            }
        });

        // Also update the response status to FLAGGED
        await prisma.assessmentResponse.update({
            where: { id: responseId },
            data: { validationStatus: 'FLAGGED' }
        });

        return NextResponse.json(clarification, { status: 201 });
    } catch (error) {
        console.error('Create clarification request error:', error);
        return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }
}

// PATCH: Reply to a clarification request (Partner) or Resolve (Reviewer)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserFromToken(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { requestId, partnerResponse, partnerFiles, reviewerDecision, reviewerNotes } = body;

        if (!requestId) {
            return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
        }

        const data: any = {};

        // Partner replying
        if (partnerResponse) {
            data.partnerResponse = partnerResponse;
            data.partnerRespondedAt = new Date();
            if (partnerFiles) data.partnerResponseFiles = partnerFiles;
        }

        // Reviewer resolving
        if (reviewerDecision) {
            data.reviewerDecision = reviewerDecision;
            data.reviewerNotes = reviewerNotes;
            data.decisionAt = new Date();
        }

        const updated = await prisma.clarificationRequest.update({
            where: { id: requestId },
            data
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update clarification request error:', error);
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }
}
