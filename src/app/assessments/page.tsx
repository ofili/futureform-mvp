'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AssessmentsHeader } from '@/components/assessments/assessments-header';
import { AssessmentsList } from '@/components/assessments/assessments-list';
import { AssessmentsEmptyState } from '@/components/assessments/assessments-empty-state';

interface Assessment {
  id: string;
  projectName: string;
  partnerName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  trustScore?: number;
  createdAt: string;
  completedAt?: string;
  redFlags: number;
}

export default function AssessmentsPage() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: async () => {
      const res = await fetch('/api/v1/assessments', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch assessments');
      const result = await res.json();
      return result.data || [];
    }
  });

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        <AssessmentsHeader />
        {!assessments?.length ? (
          <AssessmentsEmptyState />
        ) : (
          <AssessmentsList assessments={assessments} />
        )}
      </div>
    </DashboardLayout>
  );
}