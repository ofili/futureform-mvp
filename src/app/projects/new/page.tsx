'use client';

import { useState, useEffect, Suspense } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface FormOption {
  id: string;
  value: string;
  label: string;
  displayOrder: number;
}

function NewProjectContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const isSingleMode = mode === 'single';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: isSingleMode ? 'VENDOR_SELECTION_PROCUREMENT' : '',
    sector: '',
    region: '',
    status: 'ACTIVE',
    budgetRange: isSingleMode ? 'N/A' : '',
    maturityLevel: isSingleMode ? 'N/A' : '',
    timeline: '',
    objectives: isSingleMode ? 'Single partner assessment' : '',
    stakeholders: '',
    partnerEmail: '',
    assessmentMethod: 'SELF_ASSESS'
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch form options
  const { data: projectTypes = [] } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'project_type'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/form-options?category=project_type');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: projectStatuses = [] } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'project_status'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/form-options?category=project_status');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: sectors = [] } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'sector'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/form-options?category=sector');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: regions = [] } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'region'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/form-options?category=region');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: budgetRanges = [] } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'budget_range'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/form-options?category=budget_range');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: maturityLevels = [] } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'maturity_level'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/form-options?category=maturity_level');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      setError(null);

      const endpoint = '/api/v1/projects';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify({ ...data, createdById: session?.user?.id })
      });
      let json: any = null;
      try {
        json = await res.json();
      } catch (e) {
        console.error('Failed to parse response:', e);
      }
      if (!res.ok) {
        const msg = json?.error || json?.message || `Failed to create project (${res.status})`;
        throw new Error(msg);
      }
      return json as { id?: string; project?: { id?: string } };
    },
    onSuccess: (data) => {
      const id = data?.project?.id ?? data?.id;
      if (!id) {
        setError('Project created but server response did not include an id');
        return;
      }
      router.push(`/projects/${id}`);
    },
    onError: (e: any) => {
      console.error('Create project error:', e);
      setError(e?.message || 'Failed to create project');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.sector || !formData.region) {
      setError('Please fill all required fields');
      return;
    }

    createMutation.mutate(formData);
  };

  // Show loading while session is loading
  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to create a project or assessment.
            </p>
            <Button onClick={() => router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search))}>
              Go to Login
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <a href="/projects" className="hover:text-gray-900">Projects</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">New Project</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isSingleMode ? 'Quick Assessment' : 'Create New Project'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isSingleMode
                ? 'Evaluate a single partner quickly and efficiently'
                : 'Set up a multi-partner trust assessment project'
              }
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl">
              {isSingleMode ? 'Partner Information' : 'Project Details'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {isSingleMode
                ? 'Provide information about the partner you want to assess'
                : 'Provide basic information about your trust assessment project'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      {isSingleMode ? 'Partner Name' : 'Project Name'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={isSingleMode ? "e.g., Acme Corp" : "e.g., Q2 2024 Partner Assessment"}
                      required
                    />
                  </div>

                  {!isSingleMode && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map(pt => (
                          <option key={pt.id} value={pt.value}>{pt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {!isSingleMode && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the purpose, scope, and objectives..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Classification */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Project Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Sector <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.sector}
                      onChange={e => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select sector</option>
                      {sectors.map(sector => (
                        <option key={sector.id} value={sector.value}>{sector.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.region}
                      onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.value}>{region.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {projectStatuses.map(status => (
                        <option key={status.id} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Partner Email and Assessment Method - Single mode only */}
              {isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">Assessment Details</h3>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Assessment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.assessmentMethod}
                      onChange={e => setFormData(prev => ({ ...prev, assessmentMethod: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="SELF_ASSESS">Invite Partner to Self-Assess</option>
                      <option value="INDEPENDENT">Internal Assessment (I will fill it out)</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      {formData.assessmentMethod === 'SELF_ASSESS'
                        ? 'Partner will receive an email invitation to complete the assessment'
                        : 'You will complete the assessment based on available information'}
                    </p>
                  </div>

                  {formData.assessmentMethod === 'SELF_ASSESS' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Partner Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="contact@partner.com"
                        value={formData.partnerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, partnerEmail: e.target.value }))}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Assessment invitation will be sent to this email address
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Budget & Maturity - Hidden in single mode */}
              {!isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">Budget & Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Budget Range</label>
                      <select
                        value={formData.budgetRange}
                        onChange={e => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(range => (
                          <option key={range.id} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Maturity Level</label>
                      <select
                        value={formData.maturityLevel}
                        onChange={e => setFormData(prev => ({ ...prev, maturityLevel: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select maturity level</option>
                        {maturityLevels.map(level => (
                          <option key={level.id} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Timeline / Target Date</label>
                    <Input
                      type="date"
                      value={formData.timeline}
                      onChange={e => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              {!isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">Strategic Details</h3>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Key Objectives</label>
                    <Textarea
                      rows={3}
                      value={formData.objectives}
                      onChange={e => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                      placeholder="What are the main goals and objectives for this project?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Key Stakeholders</label>
                    <Textarea
                      rows={2}
                      value={formData.stakeholders}
                      onChange={e => setFormData(prev => ({ ...prev, stakeholders: e.target.value }))}
                      placeholder="List the main stakeholders involved in this project"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !formData.name || !formData.type || !formData.sector || !formData.region}
                  className="h-11 px-8 flex-1 sm:flex-none"
                >
                  {createMutation.isPending ? 'Creating...' : (isSingleMode ? 'Start Assessment' : 'Create Project')}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="h-11 px-8 flex-1 sm:flex-none"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function NewProject() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div >
        </div >
      </DashboardLayout >
    }>
      <NewProjectContent />
    </Suspense>
  );
}