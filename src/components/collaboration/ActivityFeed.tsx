'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Activity, MessageCircle, FileText, UserPlus, CheckCircle, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'comment' | 'assessment_completed' | 'user_invited' | 'document_uploaded' | 'status_changed';
  userId: string;
  userName: string;
  description: string;
  entityId: string;
  entityType: string;
  metadata: Record<string, any>;
  createdAt: string;
}

interface ActivityFeedProps {
  projectId?: string;
  limit?: number;
}

export default function ActivityFeed({ projectId, limit = 10 }: ActivityFeedProps) {
  const { data: activities = [], isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['activity-feed', projectId],
    queryFn: async () => {
      const url = projectId 
        ? `/api/v1/activity/project/${projectId}?limit=${limit}`
        : `/api/v1/activity?limit=${limit}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'assessment_completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'user_invited':
        return <UserPlus className="w-4 h-4 text-purple-500" />;
      case 'document_uploaded':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'status_changed':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'comment':
        return 'border-l-blue-500';
      case 'assessment_completed':
        return 'border-l-green-500';
      case 'user_invited':
        return 'border-l-purple-500';
      case 'document_uploaded':
        return 'border-l-orange-500';
      case 'status_changed':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 border-l-4 rounded-r-lg bg-muted/30 ${getActivityColor(activity.type)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {activity.userName.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{activity.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground">{activity.description}</p>
                  
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.metadata.tags?.map((tag: string) => (
                        <Badge key={tag} className="text-xs bg-gray-200 text-gray-800">
                          {tag}
                        </Badge>
                      ))}
                      {activity.metadata.score && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          Score: {activity.metadata.score}%
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {activities.length >= limit && (
              <div className="text-center pt-4 border-t">
                <button className="text-sm text-blue-600 hover:underline">
                  View all activity
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}