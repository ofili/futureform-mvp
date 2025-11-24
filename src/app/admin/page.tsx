'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building, FileText, DollarSign, AlertTriangle, TrendingUp, Activity, Calendar, ArrowUpRight, MoreVertical, HelpCircle, LifeBuoy, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { SystemLogsDialog } from '@/components/admin/system-logs-dialog';
import { useToast } from '@/hooks/use-toast';
interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalProjects: number;
  totalAssessments: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  pendingIssues: number;
  systemHealth: number;
}

export default function AdminDashboard() {
  const [logsOpen, setLogsOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await fetch('/api/v1/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      return result.data;
    }
  });

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const response = await fetch('/api/v1/admin/reports/monthly');

      if (!response.ok) throw new Error('Failed to generate report');

      const data = await response.json();

      // Create and download JSON report (can be enhanced to PDF later)
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly-report-${new Date().toISOString().slice(0, 7)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Report Generated',
        description: 'Monthly report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Foundations</h1>
            <Badge variant="destructive" className="text-xs">STAFF ONLY</Badge>
          </div>
          <p className="text-muted-foreground">Platform management, revenue tracking, and system health.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setLogsOpen(true)}>System Logs</Button>
          <Button onClick={handleGenerateReport} disabled={generatingReport}>
            {generatingReport ? 'Generating...' : 'Generate Monthly Report'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrganizations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue (MRR)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats?.monthlyRevenue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3 mr-1" /> Based on active tiers
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.pendingIssues || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Open support tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage user accounts, roles, and permissions across all organizations.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/users" className="flex-1">
                <Button variant="secondary" className="w-full">View Users</Button>
              </Link>
              {/* Roles page might not exist yet, pointing to users for now */}
              <Link href="/admin/users" className="flex-1">
                <Button variant="outline" className="w-full">Manage</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <Building className="w-5 h-5" />
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage client organizations, subscriptions, and billing details.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/organizations" className="flex-1">
                <Button variant="secondary" className="w-full">View Orgs</Button>
              </Link>
              <Link href="/admin/form-options" className="flex-1">
                <Button variant="outline" className="w-full">Options</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <FileText className="w-5 h-5" />
              Projects & Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Monitor all projects and assessment activities globally.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/projects" className="flex-1">
                <Button variant="secondary" className="w-full">All Projects</Button>
              </Link>
              <Link href="/admin/assessments" className="flex-1">
                <Button variant="outline" className="w-full">Assessments</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <DollarSign className="w-5 h-5" />
              Pricing & Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage pricing tiers, credit allocations, and transaction history.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/tiers" className="flex-1">
                <Button variant="secondary" className="w-full">Tiers</Button>
              </Link>
              <Link href="/admin/credit-pricing" className="flex-1">
                <Button variant="outline" className="w-full">Pricing</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <HelpCircle className="w-5 h-5" />
              Question Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage assessment questions, domains, and weighting.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/questions" className="flex-1">
                <Button variant="secondary" className="w-full">All Questions</Button>
              </Link>
              <Link href="/admin/questions/new" className="flex-1">
                <Button variant="outline" className="w-full">Add New</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* New Modules */}
        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <div className="relative">
                <LifeBuoy className="w-5 h-5" />
                {(stats?.pendingIssues || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              Support Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View and respond to user support tickets and inquiries.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/support" className="flex-1">
                <Button variant="secondary" className="w-full">
                  View Tickets
                  {(stats?.pendingIssues || 0) > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                      {stats?.pendingIssues}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <CreditCard className="w-5 h-5" />
              Billing & Reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Monitor transactions and manually reconcile payments.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/billing" className="flex-1">
                <Button variant="secondary" className="w-full">Transactions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs Dialog */}
      <SystemLogsDialog open={logsOpen} onOpenChange={setLogsOpen} />
    </div>
  );
}