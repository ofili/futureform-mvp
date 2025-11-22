'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Building, User, Calendar, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface AssessmentDetail {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    project: {
        id: string;
        name: string;
        organization: {
            id: string;
            name: string;
            sectorFocus: string | null;
            region: string | null;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
    partner: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    responses: Array<{
        id: string;
        response: any;
        createdAt: string;
        question: {
            id: string;
            text: string;
            category: string;
            weight: number;
        };
    }>;
}

export default function AssessmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.id as string;

    const { data: response, isLoading } = useQuery({
        queryKey: ['admin-assessment-detail', assessmentId],
        queryFn: async () => {
            const res = await fetch(`/api/v1/admin/assessments/${assessmentId}`);
            if (!res.ok) throw new Error('Failed to fetch assessment');
            return res.json();
        },
    });

    const assessment: AssessmentDetail | undefined = response?.data;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: 'bg-gray-500',
            IN_PROGRESS: 'bg-yellow-500',
            SUBMITTED: 'bg-blue-500',
            UNDER_REVIEW: 'bg-orange-500',
            COMPLETED: 'bg-green-500',
            ARCHIVED: 'bg-gray-400',
        };
        return colors[status] || 'bg-gray-500';
    };

    const groupResponsesByCategory = (responses: AssessmentDetail['responses']) => {
        const grouped: Record<string, typeof responses> = {};
        responses.forEach((response) => {
            const category = response.question.category;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(response);
        });
        return grouped;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading assessment details...</div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-muted-foreground">Assessment not found</div>
                <Button onClick={() => router.push('/admin/assessments')}>
                    Back to Assessments
                </Button>
            </div>
        );
    }

    const groupedResponses = groupResponsesByCategory(assessment.responses);
    const totalQuestions = 30; // Assuming 30 total questions
    const progress = Math.round((assessment.responses.length / totalQuestions) * 100);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/admin/assessments')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {assessment.partner
                                ? `${assessment.partner.firstName} ${assessment.partner.lastName}`
                                : 'Assessment'}
                        </h1>
                        <p className="text-muted-foreground mt-1">Assessment Details</p>
                    </div>
                </div>
                <Badge className={getStatusColor(assessment.status)}>
                    {assessment.status.replace('_', ' ')}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Organization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="font-medium">{assessment.project.organization.name}</div>
                        </div>
                        {assessment.project.organization.sectorFocus && (
                            <div>
                                <div className="text-sm text-muted-foreground">Sector</div>
                                <div className="font-medium">{assessment.project.organization.sectorFocus}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Project
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="font-medium">{assessment.project.name}</div>
                        </div>
                        <Link href={`/admin/projects/${assessment.project.id}`}>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                                View Project
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progress}%</div>
                        <div className="text-sm text-muted-foreground">
                            {assessment.responses.length} of {totalQuestions} questions answered
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessment.partner && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Partner
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Name</div>
                                <div className="font-medium">
                                    {assessment.partner.firstName} {assessment.partner.lastName}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Email</div>
                                <div className="font-medium">{assessment.partner.email}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Created</div>
                            <div className="font-medium">
                                {format(new Date(assessment.createdAt), 'PPP')}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Last Updated</div>
                            <div className="font-medium">
                                {format(new Date(assessment.updatedAt), 'PPP')}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Responses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    {assessment.responses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No responses yet
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedResponses).map(([category, responses]) => (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold mb-3 capitalize">
                                        {category.replace('_', ' ')}
                                    </h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50%]">Question</TableHead>
                                                <TableHead>Response</TableHead>
                                                <TableHead>Weight</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {responses.map((response) => (
                                                <TableRow key={response.id}>
                                                    <TableCell className="font-medium">
                                                        {response.question.text}
                                                    </TableCell>
                                                    <TableCell>
                                                        {typeof response.response === 'object'
                                                            ? JSON.stringify(response.response)
                                                            : response.response}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{response.question.weight}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(response.createdAt), 'PP')}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
