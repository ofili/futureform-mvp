import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { assessmentService } from '@/services/assessments/assessment.service';
import AssessmentDetailClient from './AssessmentDetailClient';

export default async function AssessmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  try {
    // Service handles: fetching, authorization, transformation
    const assessment = await assessmentService.getById(id, session.user.id);
    return <AssessmentDetailClient assessment={assessment} />;
  } catch (error) {
    notFound();
  }
}