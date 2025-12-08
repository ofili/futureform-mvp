import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Users, AlertCircle, MoreHorizontal, ChevronRight } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'assessment_completed' | 'project_created' | 'partner_invited' | 'alert';
    description: string;
    timestamp: string;
    impact: 'high' | 'medium' | 'low';
    user?: {
        name: string;
        avatar?: string;
    };
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

// Helper to group activities by date
function groupByDate(activities: ActivityItem[]) {
    const groups: { [key: string]: ActivityItem[] } = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    activities.forEach(activity => {
        const date = new Date(activity.timestamp);
        let label: string;

        if (date.toDateString() === today.toDateString()) {
            label = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            label = 'Yesterday';
        } else {
            label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        }

        if (!groups[label]) groups[label] = [];
        groups[label].push(activity);
    });

    return groups;
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const groupedActivities = groupByDate(activities);

    const getActivityConfig = (type: ActivityItem['type']) => {
        switch (type) {
            case 'assessment_completed':
                return { Icon: CheckCircle, bgColor: 'bg-green-100', iconColor: 'text-green-600', avatarBg: 'bg-green-500' };
            case 'project_created':
                return { Icon: FileText, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', avatarBg: 'bg-blue-500' };
            case 'partner_invited':
                return { Icon: Users, bgColor: 'bg-purple-100', iconColor: 'text-purple-600', avatarBg: 'bg-purple-500' };
            case 'alert':
                return { Icon: AlertCircle, bgColor: 'bg-amber-100', iconColor: 'text-amber-600', avatarBg: 'bg-amber-500' };
            default:
                return { Icon: FileText, bgColor: 'bg-gray-100', iconColor: 'text-gray-600', avatarBg: 'bg-gray-500' };
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="space-y-6">
            {Object.entries(groupedActivities).map(([dateLabel, items]) => (
                <div key={dateLabel}>
                    {/* Date Group Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{dateLabel}</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Activity Items */}
                    <div className="space-y-2">
                        {items.map((activity) => {
                            const config = getActivityConfig(activity.type);
                            const Icon = config.Icon;

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    {/* Avatar / Icon */}
                                    {activity.user?.avatar ? (
                                        <img
                                            src={activity.user.avatar}
                                            alt={activity.user.name}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />
                                    ) : activity.user?.name ? (
                                        <div className={`w-9 h-9 rounded-full ${config.avatarBg} flex items-center justify-center text-white text-sm font-medium`}>
                                            {activity.user.name.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                                            <Icon className={`w-5 h-5 ${config.iconColor}`} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 leading-snug">
                                            {activity.user?.name && (
                                                <span className="font-medium">{activity.user.name} </span>
                                            )}
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTime(activity.timestamp)}
                                        </p>
                                    </div>

                                    {/* Impact Badge & Action */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {activity.impact === 'high' && (
                                            <Badge variant="destructive" className="text-xs">High</Badge>
                                        )}
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* View All Link */}
            <div className="pt-2 border-t">
                <Button variant="ghost" size="sm" className="w-full text-gray-500 hover:text-gray-700">
                    View all activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
