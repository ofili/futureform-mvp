
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { assessmentService } from '@/services/assessments/assessment.service';
import { z } from 'zod';

const draftSchema = z.object({
    questionId: z.string(),
    response: z.any(),
    evidence: z.any().optional(),
    files: z.array(z.any()).optional(),
    lastSaved: z.string().optional().or(z.date()),
});

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        // Note: Add strict auth check here in production

        const body = await request.json();
        const validation = draftSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { questionId, ...draftData } = validation.data;

        // Use service layer
        await assessmentService.saveDraft(params.id, questionId, draftData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Draft save error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
