'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommentSystem from '@/components/collaboration/CommentSystem';
import ActivityFeed from '@/components/collaboration/ActivityFeed';
import DocumentManager from '@/components/documents/DocumentManager';
import WorkflowAutomation from '@/components/workflow/WorkflowAutomation';
import CalendarIntegration from '@/components/calendar/CalendarIntegration';
import InviteTeamMemberModal from '@/components/projects/InviteTeamMemberModal';
import CreateAssessmentWizard from '@/components/assessments/CreateAssessmentWizard';
import ComparePartnersModal from '@/components/projects/ComparePartnersModal';
import { Plus, BarChart3, Users, TrendingUp, MessageCircle, FileText, Workflow, Calendar, UserPlus, Info, ChevronRight, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import AlignmentDashboard from '@/components/projects/AlignmentDashboard';

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  sector: string;
  subsector?: string;
  region: string;
  country?: string;
  orgSize?: string;
  status: string;

  // Context
  techCategory?: string;
  techMaturity?: string;
  deploymentScope?: string;
  deploymentComplexity?: string;
  successMetrics?: string;
  projectStage?: string;
  budgetRange?: string;
  maturityLevel?: string;
  timeline?: string;
  objectives?: string;
  longDescription?: string;

  // Stakeholders
  stakeholders?: string;
  leadAgency?: string;
  implementingPartners?: string;
  vendors?: string;
  responsibleDepartments?: string;
  projectSponsor?: string;
  steeringCommittee?: boolean;
  interAgencyCollaboration?: string;

  // Risk
  fundingSource?: string;
  fundingPartners?: string;
  contractType?: string;
  contractDuration?: string;
  vendorTrackRecord?: string;
  knownRisks?: string;
  regulatoryRequirements?: string;
  dataSensitivity?: string;

  // Org
  orgDigitalMaturity?: string;
  operationalCapacity?: string;
  workforceSize?: string;
  changeReadiness?: string;
  prevFailures?: string;
  internalTrustClimate?: string;

  assessments: Array<{
    id: string;
    partnerName: string;
    partnerType: string;
    status: string;
    domainScores: Array<{ domain: string; score: number }>;
  }>;
}

export default function ProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  const [showTeamInviteModal, setShowTeamInviteModal] = useState(false);
  const [showPartnerInviteModal, setShowPartnerInviteModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { data, isLoading, isError } = useQuery<{ project: Project }>({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/projects/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Project not found');
      return res.json();
    },
  });

  const project = data?.project;

  if (isLoading) return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    </DashboardLayout>
  );

  if (isError || !project) return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        </div>
      </div>
    </DashboardLayout>
  );

  const completedAssessments = project.assessments?.filter(a => a.status === 'COMPLETED') || [];
  const pendingAssessments = project.assessments?.filter(a => a.status !== 'COMPLETED') || [];

  // Transform data for Alignment Dashboard
  const alignmentStakeholders = completedAssessments.map(a => ({
    name: a.partnerName,
    role: a.partnerType || 'Partner',
    scores: a.domainScores.reduce((acc, ds) => ({ ...acc, [ds.domain]: ds.score }), {})
  }));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/projects" className="hover:text-gray-700">Projects</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{project.name}</span>
          </nav>

          {/* Header Card */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
                  <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>{project.status}</Badge>
                </div>
                <p className="text-gray-500 mb-4 max-w-2xl">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-gray-50">{project.type.replace(/_/g, ' ')}</Badge>
                  <Badge variant="outline" className="bg-gray-50">{project.sector}</Badge>
                  <Badge variant="outline" className="bg-gray-50">{project.region}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setShowTeamInviteModal(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Team
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Invite a team member</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowPartnerInviteModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Invite Partner
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send assessment invitation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={completedAssessments.length < 2}
                        onClick={() => setShowCompareModal(true)}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Compare
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Compare partner scores</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{project.assessments?.length || 0}</p>
                  <p className="text-xs text-gray-500">Partners</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{completedAssessments.length}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{pendingAssessments.length}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {completedAssessments.length > 0
                      ? Math.round(completedAssessments.reduce((sum, a) =>
                        sum + (a.domainScores.length > 0
                          ? a.domainScores.reduce((s, d) => s + d.score, 0) / a.domainScores.length
                          : 0), 0) / completedAssessments.length)
                      : '-'}%
                  </p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="lg" onClick={() => setShowTeamInviteModal(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Team
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Invite a team member to this project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" onClick={() => setShowPartnerInviteModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Partner
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send assessment invitation to a new partner</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={completedAssessments.length < 2}
                    onClick={() => setShowCompareModal(true)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Compare Partners
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compare trust scores across all partners</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {showTeamInviteModal && (
          <InviteTeamMemberModal
            projectId={project.id}
            onClose={() => setShowTeamInviteModal(false)}
          />
        )}

        {showPartnerInviteModal && (
          <CreateAssessmentWizard
            projectId={project.id}
            onClose={() => setShowPartnerInviteModal(false)}
          />
        )}

        {showCompareModal && (
          <ComparePartnersModal
            projectId={project.id}
            assessments={completedAssessments}
            onClose={() => setShowCompareModal(false)}
          />
        )}

        <div className="space-y-6">
          {(project.assessments?.length || 0) === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Partners Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start building trust intelligence by inviting your first partner to complete an assessment.
                </p>
                <Button size="lg" onClick={() => setShowPartnerInviteModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Your First Partner
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="assessments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="assessments" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assessments
                </TabsTrigger>
                {project.type === 'MULTI_STAKEHOLDER_ALIGNMENT' && (
                  <TabsTrigger value="alignment" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Alignment
                  </TabsTrigger>
                )}
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Collaboration
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="workflow" className="flex items-center gap-2">
                  <Workflow className="w-4 h-4" />
                  Workflow
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assessments" className="space-y-4">
                {project.assessments?.map((assessment) => {
                  const avgScore =
                    assessment.domainScores.length > 0
                      ? Math.round(
                        assessment.domainScores.reduce((sum, ds) => sum + ds.score, 0) / assessment.domainScores.length
                      )
                      : 0;

                  return (
                    <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{assessment.partnerName}</h3>
                              <Badge variant={assessment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                {assessment.status.replace('_', ' ')}
                              </Badge>
                            </div>

                            {assessment.status === 'COMPLETED' && assessment.domainScores.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {assessment.domainScores.slice(0, 3).map((score) => (
                                  <TooltipProvider key={score.domain}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="px-2 py-1 bg-muted rounded text-xs cursor-help">
                                          {score.domain.slice(0, 3)} {score.score}%
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{score.domain}: {score.score}%</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                                {assessment.domainScores.length > 3 && (
                                  <div className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                                    +{assessment.domainScores.length - 3} more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            {assessment.status === 'COMPLETED' && (
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                  <span className="text-2xl font-bold text-green-600">{avgScore}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Trust Score</p>
                              </div>
                            )}

                            <Link href={`/assessments/${assessment.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="alignment">
                {completedAssessments.length < 2 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Insufficient Data</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        At least two stakeholders must complete their assessments to generate an alignment analysis.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <AlignmentDashboard projectId={project.id} stakeholders={alignmentStakeholders} />
                )}
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Identity</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">{project.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium">{project.type.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sector</p>
                            <p className="font-medium">{project.sector}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Subsector</p>
                            <p className="font-medium">{project.subsector || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Region</p>
                            <p className="font-medium">{project.region}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Country</p>
                            <p className="font-medium">{project.country || '-'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">Description</p>
                          <p className="text-sm mt-1">{project.description}</p>
                        </div>
                        {project.longDescription && (
                          <div>
                            <p className="text-muted-foreground text-sm">Full Brief</p>
                            <p className="text-sm mt-1">{project.longDescription}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Deployment Context</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tech Category</p>
                            <p className="font-medium">{project.techCategory || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tech Maturity</p>
                            <p className="font-medium">{project.techMaturity || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Scope</p>
                            <p className="font-medium">{project.deploymentScope || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stage</p>
                            <p className="font-medium">{project.projectStage || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeline</p>
                            <p className="font-medium">{project.timeline || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">{project.budgetRange || '-'}</p>
                          </div>
                        </div>
                        {project.successMetrics && (
                          <div>
                            <p className="text-muted-foreground text-sm">Success Metrics</p>
                            <p className="text-sm mt-1">{project.successMetrics}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Stakeholders & Governance</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Lead Agency</p>
                            <p className="font-medium">{project.leadAgency || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sponsor</p>
                            <p className="font-medium">{project.projectSponsor || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Steering Committee</p>
                            <p className="font-medium">{project.steeringCommittee ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                        {project.implementingPartners && (
                          <div>
                            <p className="text-muted-foreground text-sm">Implementing Partners</p>
                            <p className="text-sm mt-1">{project.implementingPartners}</p>
                          </div>
                        )}
                        {project.responsibleDepartments && (
                          <div>
                            <p className="text-muted-foreground text-sm">Responsible Departments</p>
                            <p className="text-sm mt-1">{project.responsibleDepartments}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Risk & Financial</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Funding Source</p>
                            <p className="font-medium">{project.fundingSource || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Contract Type</p>
                            <p className="font-medium">{project.contractType || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Regulatory Req.</p>
                            <p className="font-medium">{project.regulatoryRequirements || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data Sensitivity</p>
                            <p className="font-medium">{project.dataSensitivity || '-'}</p>
                          </div>
                        </div>
                        {project.knownRisks && (
                          <div>
                            <p className="text-muted-foreground text-sm">Known Risks</p>
                            <p className="text-sm mt-1">{project.knownRisks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaboration" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CommentSystem entityId={project.id} entityType="project" />
                  <ActivityFeed projectId={project.id} />
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <DocumentManager entityId={project.id} entityType="project" />
              </TabsContent>

              <TabsContent value="workflow">
                <WorkflowAutomation projectId={project.id} />
              </TabsContent>

              <TabsContent value="calendar">
                <CalendarIntegration projectId={project.id} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

