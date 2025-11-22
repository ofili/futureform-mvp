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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Assessment ID
        const userId = getUserFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { responseId, status, notes } = body;

        if (!responseId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update the response validation status
        const updatedResponse = await prisma.assessmentResponse.update({
            where: { id: responseId },
            data: {
                validationStatus: status,
                validated: status === 'VALIDATED',
                validatedAt: new Date(),
                // In a real app, we might store the reviewer ID and notes in a separate audit log or field
            }
        });

        // Check if all responses are validated to potentially update assessment status or generate score
        // For now, we just return success

        return NextResponse.json({ success: true, data: updatedResponse });
    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json({ error: 'Failed to validate response' }, { status: 500 });
    }
}
