import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
    activities: Array<{
        id: string;
        type: string;
        description: string;
        timestamp: string;
    }>;
}

export default function RecentActivity({ activities }: Props) {
    if (!activities.length) {
        return (
            <Card>
                <CardContent className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No recent activity</p>
                    <Link href="/projects/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Project
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                            <p className="font-medium">{act.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">{new Date(act.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant={act.type === 'assessment_completed' ? 'default' : 'secondary'}>
                            {act.type.replace('_', ' ')}
                        </Badge>
                    </div>
                ))}
                {activities.length > 5 && (
                    <div className="text-center pt-4 border-t">
                        <Button variant="ghost" size="sm">
                            View All Activity
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
