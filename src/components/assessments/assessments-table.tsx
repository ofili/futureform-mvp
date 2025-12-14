
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ArrowRight, AlertTriangle } from 'lucide-react';
import { EntityIdBadge } from '@/components/ui/entity-id-display';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Assessment {
    id: string;
    projectName: string;
    partnerName: string;
    status: 'pending' | 'in_progress' | 'completed' | 'expired';
    trustScore?: number;
    createdAt: string;
    completedAt?: string;
    redFlags: number;
    partnerGlobalId?: string;
    partnerAliasId?: string;
}

interface AssessmentsTableProps {
    assessments: Assessment[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'default';
        case 'in_progress': return 'secondary';
        case 'pending': return 'outline';
        case 'expired': return 'destructive';
        default: return 'secondary';
    }
};

const getTrustScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

export function AssessmentsTable({ assessments }: AssessmentsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Trust Score</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-medium">{assessment.partnerName}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <EntityIdBadge entityId={assessment.id} />
                                        {assessment.redFlags > 0 && (
                                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {assessment.redFlags} Flags
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-600">{assessment.projectName}</span>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusColor(assessment.status)}>
                                    {assessment.status.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {assessment.trustScore ? (
                                    <div className={`font-bold ${getTrustScoreColor(assessment.trustScore)}`}>
                                        {assessment.trustScore}%
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(assessment.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/assessments/${assessment.id}`} className="cursor-pointer flex items-center">
                                                View Details <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
