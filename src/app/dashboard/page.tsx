'use client';

import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SystemHealthPanel } from '@/components/dashboard/system-health-panel';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { NextActionsPanel } from '@/components/dashboard/next-actions-panel';
import { TrustLayerChart } from '@/components/dashboard/trust-layer-chart';
import { TrustTrendChart } from '@/components/dashboard/trust-trend-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AnalyticsTabs } from '@/components/dashboard/analytics-tabs';
import { TrendingUp, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MonitoringDashboard from '@/components/monitoring/MonitoringDashboard';

// Mock data
const mockStats = {
  totalProjects: 12,
  activeAssessments: 8,
  completedAssessments: 24,
  avgTrustScore: 78,
  creditsRemaining: 3,
  recentActivity: [
    { id: '1', type: 'assessment_completed' as const, description: 'Partner Alpha completed security assessment', timestamp: '2025-11-18T10:30:00Z', impact: 'high' as const },
    { id: '2', type: 'project_created' as const, description: 'New project: Q4 Vendor Compliance', timestamp: '2025-11-18T09:15:00Z', impact: 'medium' as const },
    { id: '3', type: 'partner_invited' as const, description: 'Invited 3 partners to Beta Project', timestamp: '2025-11-17T16:45:00Z', impact: 'low' as const }
  ],
  trustScoreDistribution: [
    { layer: 'Reliability', score: 85, benchmark: 75 },
    { layer: 'Transparency', score: 72, benchmark: 75 },
    { layer: 'Governance', score: 81, benchmark: 75 },
    { layer: 'Competence', score: 76, benchmark: 75 },
    { layer: 'Integrity', score: 68, benchmark: 75 }
  ],
  monthlyActivity: [
    { month: 'Aug', assessments: 12, projects: 3, avgScore: 75 },
    { month: 'Sep', assessments: 18, projects: 4, avgScore: 76 },
    { month: 'Oct', assessments: 15, projects: 2, avgScore: 79 },
    { month: 'Nov', assessments: 24, projects: 5, avgScore: 78 }
  ],
  systemHealth: 'medium',
  activeRisks: { high: 2, medium: 5, low: 8 },
  overdueAssessments: 3,
  inactivePartners: 2
};

export default function Dashboard() {
  const stats = mockStats;

  // Calculate next actions
  const nextActions = [
    stats.avgTrustScore < 70 && { text: 'Review low-scoring trust domains', priority: 'high' as const, action: 'View Details' },
    stats.creditsRemaining < 5 && { text: 'Purchase more assessment credits', priority: 'high' as const, action: 'Top Up' },
    stats.overdueAssessments > 0 && { text: `${stats.overdueAssessments} assessments need review`, priority: 'medium' as const, action: 'Review' },
    stats.inactivePartners > 0 && { text: `${stats.inactivePartners} partners inactive for 7+ days`, priority: 'low' as const, action: 'Send Reminder' }
  ].filter(Boolean) as Array<{ text: string; priority: 'high' | 'medium' | 'low'; action: string }>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <DashboardHeader />

        {/* KPI Cards - Top Row */}
        <KPICards
          avgTrustScore={stats.avgTrustScore}
          totalProjects={stats.totalProjects}
          activeAssessments={stats.activeAssessments}
          creditsRemaining={stats.creditsRemaining}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Left Column (2/3 width) */}
          <div className="xl:col-span-2 space-y-8">

            {/* Trust Intelligence */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trust Intelligence
                </h2>
                <Button variant="ghost" size="sm">View Full Report</Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TrustLayerChart data={stats.trustScoreDistribution} />
                <TrustTrendChart data={stats.monthlyActivity} />
              </div>
            </div>

            {/* Continuous Monitoring */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Continuous Monitoring
                </h2>
                <Button variant="ghost" size="sm">Manage Partners</Button>
              </div>
              <MonitoringDashboard />
            </div>

            {/* Advanced Analytics */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                Advanced Analytics
              </h2>
              <AnalyticsTabs />
            </div>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-8">

            {/* System Health */}
            <SystemHealthPanel
              avgTrustScore={stats.avgTrustScore}
              activeRisks={stats.activeRisks}
              nextActionsCount={nextActions.length}
            />

            {/* Next Actions */}
            <NextActionsPanel actions={nextActions} />

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>
              <RecentActivity activities={stats.recentActivity} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
