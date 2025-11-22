'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Search, FileText, Building, User } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface Assessment {
    id: string;
    status: string;
    project: {
        id: string;
        name: string;
        organization: {
            id: string;
            name: string;
        };
    };
    partner: {
        id: string;
        name: string;
    } | null;
    createdBy: {
        firstName: string;
        lastName: string;
        email: string;
    };
    responses: any[];
    createdAt: string;
}

export default function AssessmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: assessments, isLoading } = useQuery<Assessment[]>({
        queryKey: ['admin-assessments', statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/v1/admin/assessments?${params}`);
            if (!response.ok) throw new Error('Failed to fetch assessments');
            return response.json();
        }
    });

    const filteredAssessments = assessments?.filter(assessment =>
        !searchTerm ||
        assessment.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.project.organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.partner?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'DRAFT': 'bg-gray-500',
            'IN_PROGRESS': 'bg-yellow-500',
            'SUBMITTED': 'bg-blue-500',
            'UNDER_REVIEW': 'bg-orange-500',
            'COMPLETED': 'bg-green-500',
            'ARCHIVED': 'bg-gray-400'
        };
        return colors[status] || 'bg-gray-500';
    };

    const calculateProgress = (responses: any[]) => {
        if (!responses || responses.length === 0) return 0;
        // Assuming 30 total questions
        return Math.round((responses.length / 30) * 100);
    };

    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[
                    { label: 'Assessments', current: true }
                ]}
            />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
                    <p className="text-muted-foreground mt-2">
                        View all assessments across the platform
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search assessments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <NativeSelect
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="DRAFT">Draft</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="SUBMITTED">Submitted</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="ARCHIVED">Archived</option>
                            </NativeSelect>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div className="text-center py-8">Loading assessments...</div>
                ) : (
                    <div className="space-y-4">
                        {filteredAssessments?.map((assessment) => (
                            <Card key={assessment.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                <h3 className="text-lg font-semibold">
                                                    {assessment.partner?.name || 'Unnamed Assessment'}
                                                </h3>
                                                <Badge className={getStatusColor(assessment.status)}>
                                                    {assessment.status.replace('_', ' ')}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                                <div>
                                                    <div className="text-muted-foreground flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        Organization
                                                    </div>
                                                    <div className="font-medium">
                                                        {assessment.project.organization.name}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">Project</div>
                                                    <div className="font-medium">{assessment.project.name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        Created By
                                                    </div>
                                                    <div className="font-medium">
                                                        {assessment.createdBy.firstName} {assessment.createdBy.lastName}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">Progress</div>
                                                    <div className="font-medium">
                                                        {calculateProgress(assessment.responses)}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground mt-3">
                                                Created: {new Date(assessment.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <Link href={`/admin/assessments/${assessment.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredAssessments?.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No assessments found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
