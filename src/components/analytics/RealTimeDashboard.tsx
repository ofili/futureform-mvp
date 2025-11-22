'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Users, AlertCircle } from 'lucide-react';

interface RealTimeMetrics {
  activeUsers: number;
  assessmentsInProgress: number;
  completionRate: number;
  avgResponseTime: number;
  riskAlerts: number;
  trend: 'up' | 'down' | 'stable';
}

export default function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    assessmentsInProgress: 0,
    completionRate: 0,
    avgResponseTime: 0,
    riskAlerts: 0,
    trend: 'stable'
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/v1/analytics/realtime', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setMetrics(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.assessmentsInProgress}</div>
            <p className="text-xs text-muted-foreground">Active assessments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
            <Progress value={metrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}m</div>
            <div className="flex items-center mt-1">
              {metrics.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : metrics.trend === 'down' ? (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              ) : null}
              <span className="text-xs text-muted-foreground">Per question</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.riskAlerts}</div>
            <Badge variant="destructive" className="text-xs mt-1">
              Requires attention
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}