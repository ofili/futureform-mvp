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
import { CascadingSelect } from '@/components/ui/cascading-select';

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
    // Identity
    name: '',
    description: '',
    longDescription: '',
    type: isSingleMode ? 'VENDOR_SELECTION_PROCUREMENT' : '',
    typeSubcategory: '', // For cascading select
    sector: '',
    subsector: '',
    region: '',
    country: '',
    orgSize: '',
    status: 'ACTIVE',

    // Context
    techCategory: '',
    techMaturity: '',
    deploymentScope: '',
    deploymentComplexity: '',
    successMetrics: '',
    projectStage: '',
    budgetRange: isSingleMode ? 'N/A' : '',
    maturityLevel: isSingleMode ? 'N/A' : '', // Keep for compat
    timeline: '',
    objectives: isSingleMode ? 'Single partner assessment' : '',

    // Stakeholders
    stakeholders: '',
    leadAgency: '',
    implementingPartners: '',
    vendors: '',
    responsibleDepartments: '',
    projectSponsor: '',
    steeringCommittee: false,
    interAgencyCollaboration: '',

    // Risk/Financial
    fundingSource: '',
    fundingPartners: '',
    contractType: '',
    contractDuration: '',
    vendorTrackRecord: '',
    knownRisks: '',
    regulatoryRequirements: '',
    dataSensitivity: '',

    // Organizational
    orgDigitalMaturity: '',
    operationalCapacity: '',
    workforceSize: '',
    changeReadiness: '',
    prevFailures: '',
    internalTrustClimate: '',

    // Role Mapping
    departmentsInvolved: [] as string[],
    expectedCollaborators: '',
    keyFunctionalAreas: [] as string[],
    seniorityMix: [] as string[],
    orgStructure: '',

    // Single Mode Specific
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
                : 'Provide comprehensive information to tailor the trust assessment.'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* 1. PROJECT IDENTITY */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">1. Project Identity</h3>

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
                    <CascadingSelect
                      category="PROJECT_TYPE"
                      label="Project Type"
                      value={formData.type}
                      subValue={formData.typeSubcategory}
                      onChange={(value, subValue) => setFormData(prev => ({ ...prev, type: value, typeSubcategory: subValue || '' }))}
                      required
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-medium">Subsector</label>
                    <Input
                      value={formData.subsector}
                      onChange={e => setFormData(prev => ({ ...prev, subsector: e.target.value }))}
                      placeholder="e.g., Metro Rail, Payments"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-medium">Country</label>
                    <Input
                      value={formData.country}
                      onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="e.g., Kenya"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Short Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="1-3 sentences describing the project..."
                    rows={2}
                  />
                </div>

                {!isSingleMode && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Long Description (Full Brief)</label>
                    <Textarea
                      value={formData.longDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                      placeholder="Detailed project brief..."
                      rows={4}
                    />
                  </div>
                )}
              </div>

              {/* 2. DEPLOYMENT CONTEXT */}
              {!isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">2. Deployment Context</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Technology Category</label>
                      <Input
                        value={formData.techCategory}
                        onChange={e => setFormData(prev => ({ ...prev, techCategory: e.target.value }))}
                        placeholder="e.g., AI, IoT, ERP"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Technology Maturity</label>
                      <Input
                        value={formData.techMaturity}
                        onChange={e => setFormData(prev => ({ ...prev, techMaturity: e.target.value }))}
                        placeholder="e.g., Pilot, Proven, Legacy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Deployment Scope</label>
                      <Input
                        value={formData.deploymentScope}
                        onChange={e => setFormData(prev => ({ ...prev, deploymentScope: e.target.value }))}
                        placeholder="e.g., National, Multi-region"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Project Stage</label>
                      <Input
                        value={formData.projectStage}
                        onChange={e => setFormData(prev => ({ ...prev, projectStage: e.target.value }))}
                        placeholder="e.g., Vendor Selection, Implementation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Success Metrics (KPIs)</label>
                    <Textarea
                      value={formData.successMetrics}
                      onChange={e => setFormData(prev => ({ ...prev, successMetrics: e.target.value }))}
                      placeholder="Key Performance Indicators..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Timeline / Target Date</label>
                      <Input
                        type="date"
                        value={formData.timeline}
                        onChange={e => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                      />
                    </div>
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
                  </div>
                </div>
              )}

              {/* 3. STAKEHOLDER & GOVERNANCE */}
              {!isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">3. Stakeholder & Governance</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Lead Agency</label>
                      <Input
                        value={formData.leadAgency}
                        onChange={e => setFormData(prev => ({ ...prev, leadAgency: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Project Sponsor (Role)</label>
                      <Input
                        value={formData.projectSponsor}
                        onChange={e => setFormData(prev => ({ ...prev, projectSponsor: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Implementing Partners</label>
                    <Input
                      value={formData.implementingPartners}
                      onChange={e => setFormData(prev => ({ ...prev, implementingPartners: e.target.value }))}
                      placeholder="Comma separated list"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Responsible Departments</label>
                    <Input
                      value={formData.responsibleDepartments}
                      onChange={e => setFormData(prev => ({ ...prev, responsibleDepartments: e.target.value }))}
                      placeholder="e.g., IT, Finance, Ops"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="steeringCommittee"
                      checked={formData.steeringCommittee}
                      onChange={e => setFormData(prev => ({ ...prev, steeringCommittee: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="steeringCommittee" className="text-sm font-medium">
                      Steering Committee Present?
                    </label>
                  </div>
                </div>
              )}

              {/* 4. RISK & FINANCIAL */}
              {!isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">4. Risk, Financial & Contractual</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Funding Source</label>
                      <Input
                        value={formData.fundingSource}
                        onChange={e => setFormData(prev => ({ ...prev, fundingSource: e.target.value }))}
                        placeholder="e.g., Internal, Donor, PPP"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Contract Type</label>
                      <Input
                        value={formData.contractType}
                        onChange={e => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                        placeholder="e.g., Fixed-price, Milestone-based"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Known Risks</label>
                    <Textarea
                      value={formData.knownRisks}
                      onChange={e => setFormData(prev => ({ ...prev, knownRisks: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Regulatory Requirements</label>
                      <select
                        value={formData.regulatoryRequirements}
                        onChange={e => setFormData(prev => ({ ...prev, regulatoryRequirements: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Data Sensitivity</label>
                      <select
                        value={formData.dataSensitivity}
                        onChange={e => setFormData(prev => ({ ...prev, dataSensitivity: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. ORGANIZATIONAL CONTEXT */}
              {!isSingleMode && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">5. Organizational Context</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Digital Maturity</label>
                      <select
                        value={formData.orgDigitalMaturity}
                        onChange={e => setFormData(prev => ({ ...prev, orgDigitalMaturity: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Change Readiness</label>
                      <select
                        value={formData.changeReadiness}
                        onChange={e => setFormData(prev => ({ ...prev, changeReadiness: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Workforce Size Affected</label>
                    <Input
                      value={formData.workforceSize}
                      onChange={e => setFormData(prev => ({ ...prev, workforceSize: e.target.value }))}
                    />
                  </div>
                </div>
              )}

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