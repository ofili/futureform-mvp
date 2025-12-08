
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clarificationService } from '@/services/assessments/clarification.service';
import { z } from 'zod';

const requestSchema = z.object({
    message: z.string().min(1),
    deadline: z.string().transform((str) => new Date(str)),
});

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string; responseId: string }> }
) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // TODO: Verify user is a reviewer/admin/project owner

        const body = await request.json();
        const validation = requestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        await clarificationService.createRequest({
            assessmentResponseId: params.responseId,
            reviewerUserId: session.user.id,
            message: validation.data.message,
            deadline: validation.data.deadline
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Clarification request error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
