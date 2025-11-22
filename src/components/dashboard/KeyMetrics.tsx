import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FileText, Activity, AlertTriangle } from 'lucide-react';

interface Props {
    stats: any;
}

export default function KeyMetrics({ stats }: Props) {
    const metrics = [
        {
            title: 'Total Projects',
            icon: <FileText className="h-5 w-5 text-primary" />,
            value: stats.totalProjects,
            description: 'Assessment projects',
        },
        {
            title: 'Active Assessments',
            icon: <Activity className="h-5 w-5 text-orange-500" />,
            value: stats.activeAssessments,
            description: 'In progress',
        },
        {
            title: 'Avg Trust Score',
            icon: <TrendingUp className="h-5 w-5 text-green-500" />,
            value: stats.avgTrustScore + '%',
            description: 'Overall average',
        },
        {
            title: 'Credits Remaining',
            icon: <AlertTriangle className={`h-5 w-5 ${stats.creditsRemaining < 5 ? 'text-red-500' : 'text-blue-500'}`} />,
            value: stats.creditsRemaining,
            description: stats.creditsRemaining < 5 ? 'Low credits' : 'Available credits',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
                <Card key={metric.title} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex justify-between items-center pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                        {metric.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
