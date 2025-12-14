'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { EntityIdDisplay } from '@/components/ui/entity-id-display';
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, Building2, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Assessment {
    id: string;
    partnerName: string;
    partnerAdminEmail?: string;
    type: string;
    status: string;
    project: { id: string; name: string };
    domainScores: Array<{ domain: string; score: number; confidence: number }>;
    responses: Array<{ question: { text: string; domain: string }; response: string }>;
    redFlags: Array<{ description: string; severity: string }>;
    completedAt?: string;
    deadline?: string;
    partners: Array<{
        id: string;
        partnerName: string;
        status: string;
        adminEmail?: string;
        invitationStatus: string;
    }>;
}

interface AssessmentDetailClientProps {
    assessment: Assessment;
}

export default function AssessmentDetailClient({ assessment }: AssessmentDetailClientProps) {
    const avgScore = assessment.domainScores.length > 0
        ? Math.round(assessment.domainScores.reduce((sum, ds) => sum + ds.score, 0) / assessment.domainScores.length)
        : 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Breadcrumb items={[
                { label: 'Projects', href: '/projects' },
                { label: assessment.project?.name || 'Project', href: `/projects/${assessment.project?.id}` },
                { label: assessment.type, current: true }
            ]} />

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl font-bold">{assessment.type}</h1>
                        <Badge variant={assessment.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                            {assessment.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {assessment.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    {assessment.completedAt && (
                        <p className="text-muted-foreground">
                            Completed on {new Date(assessment.completedAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    )}
                    <div className="mt-2">
                        <EntityIdDisplay entityType="Assessment" entityId={assessment.id} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {assessment.status === 'COMPLETED' && (
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-1">{avgScore}%</div>
                            <p className="text-sm text-muted-foreground">Overall Trust Score</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Link href={`/projects/${assessment.project?.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Project
                            </Button>
                        </Link>

                        {assessment.status === 'COMPLETED' && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download assessment report</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share assessment results</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="responses" className="flex items-center gap-2">
                        Responses ({assessment.responses?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        Trust Profile
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Partners Information Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-muted-foreground" />
                                Participating Partners
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {assessment.partners && assessment.partners.length > 0 ? (
                                    assessment.partners.map((partner) => (
                                        <div key={partner.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                            <div>
                                                <p className="font-medium">{partner.partnerName}</p>
                                                {partner.adminEmail && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        <a href={`mailto:${partner.adminEmail}`} className="text-xs text-blue-600 hover:underline">
                                                            {partner.adminEmail}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant={partner.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                    {partner.status.replace('_', ' ')}
                                                </Badge>
                                                {partner.invitationStatus === 'PENDING' && (
                                                    <span className="text-[10px] text-muted-foreground">Invite Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground italic">
                                        No partners invited yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {assessment.domainScores.map((score) => {
                            const getScoreColor = (score: number) => {
                                if (score >= 80) return 'text-green-600';
                                if (score >= 60) return 'text-yellow-600';
                                return 'text-red-600';
                            };

                            return (
                                <Card key={score.domain} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {score.domain.replace('_', ' ')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-3xl font-bold mb-1 ${getScoreColor(score.score)}`}>
                                            {score.score}%
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <p className="text-xs text-muted-foreground cursor-help">
                                                    {score.confidence}% confidence
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Based on evidence quality and validation</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {assessment.redFlags.length > 0 && (
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="text-red-700 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Risk Indicators ({assessment.redFlags.length})
                                </CardTitle>
                                <p className="text-sm text-red-600 mt-1">
                                    Areas requiring attention or further investigation
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {assessment.redFlags.map((flag, idx) => (
                                        <div key={idx} className="flex items-start justify-between p-4 bg-white rounded-lg border border-red-200">
                                            <div className="flex-1">
                                                <p className="font-medium text-red-900">{flag.description}</p>
                                            </div>
                                            <Badge variant="destructive" className="ml-3">
                                                {flag.severity}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="responses" className="space-y-6">
                    <div className="mb-4">
                        <p className="text-muted-foreground">
                            Detailed responses to all {assessment.responses?.length || 0} trust framework questions
                        </p>
                    </div>

                    <div className="space-y-6">
                        {assessment.responses.map((response, idx) => (
                            <Card key={idx} className="hover:shadow-sm transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <CardTitle className="text-base leading-relaxed flex-1">
                                            {response.question.text}
                                        </CardTitle>
                                        <Badge variant="outline" className="self-start">
                                            {response.question.domain.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                                            {response.response || 'No response provided'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="text-green-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Strengths
                                </CardTitle>
                                <p className="text-sm text-green-700 mt-1">
                                    Areas where the partner demonstrates strong trust indicators
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {assessment.domainScores
                                        .filter(s => s.score >= 70)
                                        .map(s => (
                                            <div key={s.domain} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                                                <span className="font-medium text-green-900">
                                                    {s.domain.replace('_', ' ')}
                                                </span>
                                                <span className="text-green-700 font-bold">{s.score}%</span>
                                            </div>
                                        ))}
                                    {assessment.domainScores.filter(s => s.score >= 70).length === 0 && (
                                        <p className="text-green-700 italic">No domains scoring above 70%</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="text-orange-800 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Areas for Improvement
                                </CardTitle>
                                <p className="text-sm text-orange-700 mt-1">
                                    Domains that may benefit from additional attention or evidence
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {assessment.domainScores
                                        .filter(s => s.score < 70)
                                        .map(s => (
                                            <div key={s.domain} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                                                <span className="font-medium text-orange-900">
                                                    {s.domain.replace('_', ' ')}
                                                </span>
                                                <span className="text-orange-700 font-bold">{s.score}%</span>
                                            </div>
                                        ))}
                                    {assessment.domainScores.filter(s => s.score < 70).length === 0 && (
                                        <p className="text-orange-700 italic">All domains scoring above 70%</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-muted-foreground leading-relaxed">
                                    {avgScore >= 80 && "This partner demonstrates strong trust indicators across most domains, suggesting a reliable and trustworthy collaboration potential."}
                                    {avgScore >= 60 && avgScore < 80 && "This partner shows moderate trust indicators with some areas of strength and others requiring attention or additional evidence."}
                                    {avgScore < 60 && "This partner may require additional due diligence or capacity building before proceeding with significant collaboration."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
