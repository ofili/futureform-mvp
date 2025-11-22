import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface ProjectsTableProps {
    projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr className="text-left">
                                <th className="p-4 font-medium">Project Name</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Sector</th>
                                <th className="p-4 font-medium">Region</th>
                                <th className="p-4 font-medium">Budget</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Assessments</th>
                                <th className="p-4 font-medium">Created</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium">{project.name}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {project.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">{project.projectType}</td>
                                    <td className="p-4 text-sm">{project.sector}</td>
                                    <td className="p-4 text-sm">{project.region}</td>
                                    <td className="p-4 text-sm">{project.budgetRange || '-'}</td>
                                    <td className="p-4">
                                        <Badge className={project.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'}>
                                            {project.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm">{project.assessmentCount}</td>
                                    <td className="p-4 text-sm">{new Date(project.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <Link href={`/projects/${project.id}`}>
                                            <Button className="h-8 px-3 text-xs border border-gray-300 bg-white hover:bg-gray-50 text-gray-700">
                                                View
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
