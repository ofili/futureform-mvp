import { NextRequest, NextResponse } from 'next/server';
import { trustOntologyService } from '@/lib/services/trust-ontology.service';
import { TrustEvidenceWeight } from '@prisma/client';
import type { QuestionFilters } from '@/types/trust';

/**
 * GET /api/v1/trust/questions
 * 
 * Get trust questions with optional filters
 * Query params:
 * - partnerTypeId: Filter by partner type
 * - layerId: Filter by layer
 * - stakeholderType: Filter by stakeholder type
 * - evidenceWeight: Filter by evidence weight (CRITICAL, HIGH, MEDIUM, LOW)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const filters: QuestionFilters = {};

        if (searchParams.has('partnerTypeId')) {
            filters.partnerTypeId = searchParams.get('partnerTypeId')!;
        }

        if (searchParams.has('layerId')) {
            filters.layerId = searchParams.get('layerId')!;
        }

        if (searchParams.has('stakeholderType')) {
            filters.stakeholderType = searchParams.get('stakeholderType')!;
        }

        if (searchParams.has('evidenceWeight')) {
            const weight = searchParams.get('evidenceWeight')!.toUpperCase();
            if (Object.values(TrustEvidenceWeight).includes(weight as TrustEvidenceWeight)) {
                filters.evidenceWeight = weight as TrustEvidenceWeight;
            }
        }

        const result = await trustOntologyService.getQuestions(filters);

        return NextResponse.json({
            success: true,
            data: result.questions,
            total: result.total,
            filters,
        });
    } catch (error) {
        console.error('Error fetching trust questions:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch trust questions',
            },
            { status: 500 }
        );
    }
}
