import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/trust/questions/[questionId]
 * 
 * Get a specific trust question by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ questionId: string }> }
) {
    try {
        const { questionId } = await params;

        const question = await trustOntologyService.getQuestionById(questionId);

        if (!question) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Trust question not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: question,
        });
    } catch (error) {
        console.error('Error fetching trust question:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch trust question',
            },
            { status: 500 }
        );
    }
}
