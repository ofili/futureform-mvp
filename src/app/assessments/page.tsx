'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { AssessmentsList } from '@/components/assessments/assessments-list';
import { AssessmentsEmptyState } from '@/components/assessments/assessments-empty-state';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  // Stats
  const stats = {
    total: assessments?.length || 0,
    completed: assessments?.filter(a => a.status === 'completed').length || 0,
    inProgress: assessments?.filter(a => a.status === 'in_progress').length || 0,
    pending: assessments?.filter(a => a.status === 'pending').length || 0,
    avgScore: assessments?.length
      ? Math.round(assessments.filter(a => a.trustScore).reduce((sum, a) => sum + (a.trustScore || 0), 0) / assessments.filter(a => a.trustScore).length)
      : 0
  };

  // Filter assessments
  const filteredAssessments = assessments?.filter(a =>
    a.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Assessments"
            description="Track partner trust assessments and results"
            breadcrumbs={[{ label: 'Assessments' }]}
            searchPlaceholder="Search by partner or project..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            actions={
              <Link href="/assessments/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Assessment
                </Button>
              </Link>
            }
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-4 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stats.avgScore >= 70 ? 'bg-green-100' : 'bg-amber-100'}`}>
                  <TrendingUp className={`w-4 h-4 ${stats.avgScore >= 70 ? 'text-green-600' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.avgScore}%</p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ) : !filteredAssessments?.length ? (
            <AssessmentsEmptyState />
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <AssessmentsList assessments={filteredAssessments} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}