import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface Assessment {
    id: string;
    projectName: string;
    partnerName: string;
    status: 'pending' | 'in_progress' | 'completed' | 'expired';
    trustScore?: number;
    createdAt: string;
    completedAt?: string;
    redFlags: number;
}

interface AssessmentCardProps {
    assessment: Assessment;
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

export function AssessmentCard({ assessment }: AssessmentCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{assessment.partnerName}</h3>
                            <Badge variant={getStatusColor(assessment.status)}>
                                {assessment.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Project: {assessment.projectName}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Created {new Date(assessment.createdAt).toLocaleDateString()}</span>
                            </div>
                            {assessment.completedAt && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Completed {new Date(assessment.completedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {assessment.trustScore && (
                            <div className="text-center">
                                <div className="flex items-center gap-1 mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs text-muted-foreground">Trust Score</span>
                                </div>
                                <div className={`text-2xl font-bold ${getTrustScoreColor(assessment.trustScore)}`}>
                                    {assessment.trustScore}%
                                </div>
                            </div>
                        )}

                        {assessment.redFlags > 0 && (
                            <div className="text-center">
                                <div className="flex items-center gap-1 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs text-muted-foreground">Red Flags</span>
                                </div>
                                <div className="text-2xl font-bold text-red-600">
                                    {assessment.redFlags}
                                </div>
                            </div>
                        )}

                        <Link href={`/assessments/${assessment.id}`}>
                            <Button variant="outline">
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
