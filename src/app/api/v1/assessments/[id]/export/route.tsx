import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { renderToStream } from '@react-pdf/renderer';
import { TrustProfilePDF } from '@/components/pdf/TrustProfilePDF';
import { format } from 'date-fns';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                partner: true,
                scores: true,
            },
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        // Mock data if scores are missing (for MVP)
        const overallScore = assessment.overallScore || 0;
        const domainScores = assessment.scores.map(s => ({
            domain: s.domain,
            score: s.score,
        }));

        const stream = await renderToStream(
            <TrustProfilePDF
                partnerName={`${assessment.partner.firstName} ${assessment.partner.lastName}`}
                overallScore = { overallScore }
    domainScores = { domainScores }
    generatedAt = { format(new Date(), 'PPP')
}
            />
        );

return new NextResponse(stream as any, {
    headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TrustProfile-${assessment.partner.firstName}-${assessment.partner.lastName}.pdf"`,
    },
});
    } catch (error) {
    console.error('PDF Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
}
