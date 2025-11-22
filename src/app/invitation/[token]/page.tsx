'use client';

import AssessmentForm from '@/components/assessment/AssessmentForm';

export default function PartnerAssessment({ params }: { params: { token: string } }) {
  return <AssessmentForm assessmentId="" token={params.token} />;
}