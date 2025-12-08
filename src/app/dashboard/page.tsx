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
import { QuickAccessPanel } from '@/components/dashboard/quick-access-panel';
import { TrendingUp, Activity, Calendar, ShieldCheck, MoreHorizontal } from 'lucide-react';
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
    { id: '1', type: 'assessment_completed' as const, description: 'completed security assessment for Partner Alpha', timestamp: new Date().toISOString(), impact: 'high' as const, user: { name: 'Sarah Chen' } },
    { id: '2', type: 'project_created' as const, description: 'created new project: Q4 Vendor Compliance', timestamp: new Date(Date.now() - 3600000).toISOString(), impact: 'medium' as const, user: { name: 'Marcus Johnson' } },
    { id: '3', type: 'partner_invited' as const, description: 'invited 3 partners to Beta Project', timestamp: new Date(Date.now() - 86400000).toISOString(), impact: 'low' as const, user: { name: 'Emily Rodriguez' } },
    { id: '4', type: 'alert' as const, description: 'Trust score dropped below threshold for Vendor XYZ', timestamp: new Date(Date.now() - 90000000).toISOString(), impact: 'high' as const }
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

// Card wrapper component for consistent styling
function DashboardCard({
  children,
  title,
  icon: Icon,
  action,
  className = ''
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/30">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-blue-600" />}
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {action}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

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
      {/* Subtle Background Pattern */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <DashboardHeader />

          {/* Quick Access Section */}
          <QuickAccessPanel />

          {/* KPI Cards - Top Row */}
          <KPICards
            avgTrustScore={stats.avgTrustScore}
            totalProjects={stats.totalProjects}
            activeAssessments={stats.activeAssessments}
            creditsRemaining={stats.creditsRemaining}
          />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left Column (2/3 width) */}
            <div className="xl:col-span-2 space-y-6">

              {/* Trust Intelligence */}
              <DashboardCard
                title="Trust Intelligence"
                icon={TrendingUp}
                action={<Button variant="ghost" size="sm">View Full Report</Button>}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <TrustLayerChart data={stats.trustScoreDistribution} />
                  <TrustTrendChart data={stats.monthlyActivity} />
                </div>
              </DashboardCard>

              {/* Continuous Monitoring */}
              <DashboardCard
                title="Continuous Monitoring"
                icon={ShieldCheck}
                action={<Button variant="ghost" size="sm">Manage Partners</Button>}
              >
                <MonitoringDashboard />
              </DashboardCard>

              {/* Advanced Analytics */}
              <DashboardCard title="Advanced Analytics" icon={Calendar}>
                <AnalyticsTabs />
              </DashboardCard>
            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-6">

              {/* System Health */}
              <SystemHealthPanel
                avgTrustScore={stats.avgTrustScore}
                activeRisks={stats.activeRisks}
                nextActionsCount={nextActions.length}
              />

              {/* Next Actions */}
              <NextActionsPanel actions={nextActions} />

              {/* Recent Activity */}
              <DashboardCard title="Recent Activity" icon={Activity}>
                <RecentActivity activities={stats.recentActivity} />
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
