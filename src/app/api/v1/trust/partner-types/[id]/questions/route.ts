import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';

/**
 * GET /api/v1/trust/partner-types/[id]/questions
 * 
 * Get all questions for a specific partner type
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const questions = await trustOntologyService.getQuestionsForPartnerType(id);

        return NextResponse.json({
            success: true,
            data: questions,
            total: questions.length,
        });
    } catch (error) {
        console.error('Error fetching partner type questions:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch partner type questions',
            },
            { status: 500 }
        );
    }
}
