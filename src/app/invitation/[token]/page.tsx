'use client';

import AssessmentForm from '@/components/assessment/AssessmentForm';

import { useParams } from 'next/navigation';

export default function PartnerAssessment() {
  const params = useParams();
  const token = params.token as string;
  return <AssessmentForm assessmentId="" token={token} />;
}