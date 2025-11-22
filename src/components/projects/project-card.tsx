import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    description: string;
    projectType: string;
    sector: string;
    region: string;
    status: string;
    createdAt: string;
    assessmentCount: number;
    budgetRange?: string;
}

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={project.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'}>
                        {project.status}
                    </Badge>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{project.sector}</span>
                    <span>•</span>
                    <span>{project.region}</span>
                    {project.budgetRange && (
                        <>
                            <span>•</span>
                            <span>{project.budgetRange}</span>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{project.assessmentCount} assessments</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <Link href={`/projects/${project.id}`}>
                    <Button className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2">
                        View Project
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
