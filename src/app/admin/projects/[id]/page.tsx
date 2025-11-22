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
import { ArrowLeft, Building, User, Calendar, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ProjectDetail {
    id: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
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
    assessments: Array<{
        id: string;
        status: string;
        createdAt: string;
        partner: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        } | null;
        responses: Array<{ id: string }>;
    }>;
    members: Array<{
        role: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    }>;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { data: response, isLoading } = useQuery({
        queryKey: ['admin-project-detail', projectId],
        queryFn: async () => {
            const res = await fetch(`/api/v1/admin/projects/${projectId}`);
            if (!res.ok) throw new Error('Failed to fetch project');
            return res.json();
        },
    });

    const project: ProjectDetail | undefined = response?.data;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: 'bg-gray-500',
            ACTIVE: 'bg-green-500',
            COMPLETED: 'bg-blue-500',
            ARCHIVED: 'bg-gray-400',
        };
        return colors[status] || 'bg-gray-500';
    };

    const getAssessmentStatusColor = (status: string) => {
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading project details...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-muted-foreground">Project not found</div>
                <Button onClick={() => router.push('/admin/projects')}>
                    Back to Projects
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/admin/projects')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-muted-foreground mt-1">Project Details</p>
                    </div>
                </div>
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>

            {project.description && (
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{project.description}</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="font-medium">{project.organization.name}</div>
                        </div>
                        {project.organization.sectorFocus && (
                            <div>
                                <div className="text-sm text-muted-foreground">Sector</div>
                                <div className="font-medium">{project.organization.sectorFocus}</div>
                            </div>
                        )}
                        {project.organization.region && (
                            <div>
                                <div className="text-sm text-muted-foreground">Region</div>
                                <div className="font-medium">{project.organization.region}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Project Owner
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="font-medium">
                                {project.createdBy.firstName} {project.createdBy.lastName}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Email</div>
                            <div className="font-medium">{project.createdBy.email}</div>
                        </div>
                    </CardContent>
                </Card>

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
                                {format(new Date(project.createdAt), 'PPP')}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Last Updated</div>
                            <div className="font-medium">
                                {format(new Date(project.updatedAt), 'PPP')}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Team Members
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{project.members.length}</div>
                        <div className="text-sm text-muted-foreground">Active members</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Assessments ({project.assessments.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {project.assessments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No assessments yet
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Partner</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {project.assessments.map((assessment) => (
                                    <TableRow key={assessment.id}>
                                        <TableCell>
                                            {assessment.partner
                                                ? `${assessment.partner.firstName} ${assessment.partner.lastName}`
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getAssessmentStatusColor(assessment.status)}>
                                                {assessment.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {assessment.responses.length} responses
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(assessment.createdAt), 'PP')}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/assessments/${assessment.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {project.members.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {project.members.map((member) => (
                                    <TableRow key={member.user.id}>
                                        <TableCell>
                                            {member.user.firstName} {member.user.lastName}
                                        </TableCell>
                                        <TableCell>{member.user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{member.role}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
