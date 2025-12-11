'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AssessmentWizard from '@/components/assessments/wizard/assessment-wizard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronRight, FileText, Loader2, ClipboardCheck, Building2, Users, Briefcase, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    status: string;
    type: string;
    sector: string;
}

interface Template {
    id: string;
    value: string;
    label: string;
    displayOrder: number;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
    technology_vendor_assessment: <FileText className="w-5 h-5" />,
    supplier_due_diligence: <Building2 className="w-5 h-5" />,
    partner_evaluation: <Users className="w-5 h-5" />,
    contractor_vetting: <Briefcase className="w-5 h-5" />,
    investment_target_screening: <TrendingUp className="w-5 h-5" />,
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
    technology_vendor_assessment: 'Evaluate technology and software vendors',
    supplier_due_diligence: 'Verify supplier capabilities and compliance',
    partner_evaluation: 'Assess potential partnership value and alignment',
    contractor_vetting: 'Screen contractors before engagement',
    investment_target_screening: 'Pre-investment due diligence',
};

function NewAssessmentContent() {
    const { data: session, status: authStatus } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const projectIdFromUrl = searchParams.get('projectId');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectIdFromUrl);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [showWizard, setShowWizard] = useState(false);

    // Fetch user's projects
    const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
        queryKey: ['user-projects'],
        queryFn: async () => {
            const res = await fetch('/api/v1/projects');
            if (!res.ok) return [];
            const data = await res.json();
            return data.data || data.projects || data || [];
        },
        enabled: !!session?.user?.id,
    });

    // Fetch assessment templates
    const { data: templates = [], isLoading: templatesLoading } = useQuery<Template[]>({
        queryKey: ['assessment-templates'],
        queryFn: async () => {
            const res = await fetch('/api/v1/admin/form-options?category=assessment_template');
            if (!res.ok) return [];
            return res.json();
        },
    });

    // If projectId from URL, fetch that specific project
    const { data: prefilledProject } = useQuery<Project>({
        queryKey: ['project', projectIdFromUrl],
        queryFn: async () => {
            const res = await fetch(`/api/v1/projects/${projectIdFromUrl}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.project;
        },
        enabled: !!projectIdFromUrl,
    });

    useEffect(() => {
        if (projectIdFromUrl) {
            setSelectedProjectId(projectIdFromUrl);
        }
    }, [projectIdFromUrl]);

    if (authStatus === 'loading') {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </DashboardLayout>
        );
    }

    if (authStatus === 'unauthenticated') {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                    <div className="p-6">
                        <Card className="max-w-md mx-auto">
                            <CardHeader>
                                <CardTitle>Authentication Required</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">Please log in to create an assessment.</p>
                                <Button onClick={() => router.push('/auth/login')}>
                                    Go to Login
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Show wizard if project and template are selected
    if (showWizard && selectedProjectId && selectedTemplate) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                    <div className="p-6 space-y-6">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1 text-sm text-gray-500">
                            <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/assessments" className="hover:text-gray-700">Assessments</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900 font-medium">New Assessment</span>
                        </nav>

                        {/* Show project and template context */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-700">
                                    <strong>Project:</strong> {prefilledProject?.name || projects.find(p => p.id === selectedProjectId)?.name}
                                </p>
                                <p className="text-sm text-blue-700">
                                    <strong>Template:</strong> {templates.find(t => t.value === selectedTemplate)?.label}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setShowWizard(false)}>
                                Change
                            </Button>
                        </div>

                        <AssessmentWizard projectId={selectedProjectId} templateId={selectedTemplate} />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Show project and template selection
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                <div className="p-6 space-y-6 max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1 text-sm text-gray-500">
                        <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/assessments" className="hover:text-gray-700">Assessments</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">New Assessment</span>
                    </nav>

                    {/* Header */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <ClipboardCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Create New Assessment</h1>
                                <p className="text-gray-500">Select a project and assessment template</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Project Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                                Select Project
                            </CardTitle>
                            <CardDescription>Choose the project this assessment belongs to</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {projectsLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-6">
                                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No projects found.</p>
                                    <Button onClick={() => router.push('/projects/new')}>
                                        Create Project
                                    </Button>
                                </div>
                            ) : (
                                <select
                                    value={selectedProjectId || ''}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    disabled={!!projectIdFromUrl}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name} ({project.type?.replace(/_/g, ' ') || 'N/A'})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 2: Template Selection */}
                    <Card className={!selectedProjectId ? 'opacity-50 pointer-events-none' : ''}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className={`w-6 h-6 ${selectedProjectId ? 'bg-blue-600' : 'bg-gray-300'} text-white rounded-full flex items-center justify-center text-sm`}>2</span>
                                Select Assessment Template
                            </CardTitle>
                            <CardDescription>Choose the type of assessment to conduct</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {templatesLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {templates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(template.value)}
                                            className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-start gap-4 ${selectedTemplate === template.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${selectedTemplate === template.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {TEMPLATE_ICONS[template.value] || <FileText className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{template.label}</p>
                                                <p className="text-sm text-gray-500">{TEMPLATE_DESCRIPTIONS[template.value] || ''}</p>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Fallback if no templates in DB */}
                                    {templates.length === 0 && (
                                        <div className="text-center py-6 text-gray-500">
                                            <p>No templates found. Run the seed script first:</p>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                                                npx tsx prisma/seed-assessment-templates.ts
                                            </code>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowWizard(true)}
                            disabled={!selectedProjectId || !selectedTemplate}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Continue to Assessment Setup
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/assessments')}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function NewAssessmentPage() {
    return (
        <Suspense fallback={
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </DashboardLayout>
        }>
            <NewAssessmentContent />
        </Suspense>
    );
}
