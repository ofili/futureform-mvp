
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clarificationService } from '@/services/assessments/clarification.service';
import { z } from 'zod';

const replySchema = z.object({
    responseText: z.string().min(1),
    files: z.array(z.string()).optional(),
});

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string; responseId: string }> }
) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        // Note: Add strict auth check here

        const body = await request.json();
        const validation = replySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        await clarificationService.submitReply({
            assessmentResponseId: params.responseId,
            responseText: validation.data.responseText,
            files: validation.data.files
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Clarification reply error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
