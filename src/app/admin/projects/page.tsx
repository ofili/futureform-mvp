'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Search, Building, FileText } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface Project {
    id: string;
    name: string;
    description: string | null;
    status: string;
    organization: {
        id: string;
        name: string;
    };
    owner: {
        firstName: string;
        lastName: string;
        email: string;
    };
    assessments: any[];
    createdAt: string;
}

export default function ProjectsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: projects, isLoading } = useQuery<Project[]>({
        queryKey: ['admin-projects', statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/v1/admin/projects?${params}`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            return response.json();
        }
    });

    const filteredProjects = projects?.filter(project =>
        !searchTerm || project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'DRAFT': 'bg-gray-500',
            'ACTIVE': 'bg-green-500',
            'COMPLETED': 'bg-blue-500',
            'ARCHIVED': 'bg-gray-400'
        };
        return colors[status] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[
                    { label: 'Projects', current: true }
                ]}
            />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-2">
                        View all projects across the platform
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
                                    placeholder="Search projects..."
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
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="ARCHIVED">Archived</option>
                            </NativeSelect>
                        </div>
                    </CardContent>
                </Card >

                {
                    isLoading ? (
                        <div className="text-center py-8" > Loading projects...</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredProjects?.map((project) => (
                                <Card key={project.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <h3 className="text-lg font-semibold">{project.name}</h3>
                                                    <Badge className={getStatusColor(project.status)}>
                                                        {project.status}
                                                    </Badge>
                                                </div>

                                                {project.description && (
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {project.description}
                                                    </p>
                                                )}

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <div className="text-muted-foreground flex items-center gap-1">
                                                            <Building className="h-3 w-3" />
                                                            Organization
                                                        </div>
                                                        <div className="font-medium">{project.organization.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground">Owner</div>
                                                        <div className="font-medium">
                                                            {project.owner.firstName} {project.owner.lastName}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground">Assessments</div>
                                                        <div className="font-medium">{project.assessments.length}</div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground mt-3">
                                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <Link href={`/admin/projects/${project.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {filteredProjects?.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No projects found
                                </div>
                            )}
                        </div>
                    )
                }
            </div >
        </div >
    );
}
