import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import AssessmentDetailClient from './AssessmentDetailClient';

export default async function AssessmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      project: {
        select: { id: true, name: true }
      },
      scores: true,
      redFlags: true,
      responses: {
        include: {
          question: {
            select: { text: true, domain: true }
          }
        }
      }
    }
  });

  if (!assessment) {
    notFound();
  }

  // Transform data to match the interface expected by the client component
  // and convert Date objects to strings to avoid serialization issues
  const transformedAssessment = {
    id: assessment.id,
    partnerName: assessment.partnerName,
    status: assessment.status,
    project: assessment.project,
    domainScores: assessment.scores.map(s => ({
      domain: s.domain,
      score: s.score,
      confidence: s.confidence
    })),
    responses: assessment.responses.map(r => ({
      question: r.question,
      response: r.response
    })),
    redFlags: assessment.redFlags.map(f => ({
      description: f.description,
      severity: f.severity
    })),
    completedAt: assessment.completedAt?.toISOString(),
  };

  return <AssessmentDetailClient assessment={transformedAssessment} />;
}