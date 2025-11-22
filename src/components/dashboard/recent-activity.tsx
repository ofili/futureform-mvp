import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle, FileText, Users } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'assessment_completed' | 'project_created' | 'partner_invited';
    description: string;
    timestamp: string;
    impact: 'high' | 'medium' | 'low';
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Latest updates grouped by day
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => {
                        const Icon = activity.type === 'assessment_completed' ? CheckCircle :
                            activity.type === 'project_created' ? FileText : Users;

                        const bgColor = activity.type === 'assessment_completed' ? 'bg-green-100 dark:bg-green-900' :
                            activity.type === 'project_created' ? 'bg-blue-100 dark:bg-blue-900' :
                                'bg-purple-100 dark:bg-purple-900';

                        const iconColor = activity.type === 'assessment_completed' ? 'text-green-600' :
                            activity.type === 'project_created' ? 'text-blue-600' :
                                'text-purple-600';

                        return (
                            <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                                <div className={`p-3 rounded-lg ${bgColor}`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(activity.timestamp).toLocaleString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={activity.impact === 'high' ? 'default' : 'secondary'} className="capitalize">
                                        {activity.impact} impact
                                    </Badge>
                                    <Button size="sm" variant="ghost">
                                        View
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
