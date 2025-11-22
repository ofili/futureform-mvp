'use client';

import { use } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
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
import { Plus, BarChart3, Users, TrendingUp, MessageCircle, FileText, Workflow, Calendar, UserPlus } from 'lucide-react';
import Link from 'next/link';
import AlignmentDashboard from '@/components/projects/AlignmentDashboard';

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  assessments: Array<{
    id: string;
    partnerName: string;
    partnerType: string;
    status: string;
    domainScores: Array<{ domain: string; score: number }>;
  }>;
}

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showTeamInviteModal, setShowTeamInviteModal] = useState(false);
  const [showPartnerInviteModal, setShowPartnerInviteModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { data, isLoading, isError } = useQuery<{ project: Project }>({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/projects/${id}`, {
        credentials: 'include', // Include NextAuth session cookies
      });
      if (!res.ok) throw new Error('Project not found');
      return res.json();
    },
  });

  const project = data?.project;

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !project) return <div className="p-8">Project not found</div>;

  const completedAssessments = project.assessments?.filter(a => a.status === 'COMPLETED') || [];

  // Transform data for Alignment Dashboard
  const alignmentStakeholders = completedAssessments.map(a => ({
    name: a.partnerName,
    role: a.partnerType || 'Partner',
    scores: a.domainScores.reduce((acc, ds) => ({ ...acc, [ds.domain]: ds.score }), {})
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/projects' },
          { label: project.name, current: true },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3">{project.name}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{project.description}</p>
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
            <TabsList className="grid w-full grid-cols-6">
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
  );
}
