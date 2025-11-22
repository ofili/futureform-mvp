'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, TrendingDown, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';

interface MonitoredPartner {
    id: string;
    name: string;
    status: 'ACTIVE' | 'PROBATION' | 'AT_RISK';
    trustScore: number;
    lastAssessmentDate: string;
    nextAssessmentDate: string;
    activeAlerts: number;
}

export default function MonitoringDashboard() {
    // Mock data for now - would come from API
    const partners: MonitoredPartner[] = [
        {
            id: '1',
            name: 'Acme Corp',
            status: 'ACTIVE',
            trustScore: 92,
            lastAssessmentDate: '2023-10-15',
            nextAssessmentDate: '2024-10-15',
            activeAlerts: 0
        },
        {
            id: '2',
            name: 'Globex Inc',
            status: 'PROBATION',
            trustScore: 78,
            lastAssessmentDate: '2023-11-01',
            nextAssessmentDate: '2024-05-01',
            activeAlerts: 2
        },
        {
            id: '3',
            name: 'Soylent Corp',
            status: 'AT_RISK',
            trustScore: 65,
            lastAssessmentDate: '2023-09-20',
            nextAssessmentDate: '2024-03-20',
            activeAlerts: 5
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{partners.filter(p => p.status === 'ACTIVE').length}</div>
                        <p className="text-xs text-muted-foreground">Fully compliant</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{partners.filter(p => p.status === 'AT_RISK').length}</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">Next 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Partner Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {partners.map((partner) => (
                            <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${partner.status === 'ACTIVE' ? 'bg-green-500' :
                                            partner.status === 'PROBATION' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />
                                    <div>
                                        <h3 className="font-semibold">{partner.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Last assessed: {new Date(partner.lastAssessmentDate).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Next: {new Date(partner.nextAssessmentDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="font-bold text-lg">{partner.trustScore}</span>
                                            {partner.trustScore >= 80 ? (
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Trust Score</p>
                                    </div>

                                    {partner.activeAlerts > 0 && (
                                        <Badge variant="destructive" className="gap-1">
                                            <Bell className="w-3 h-3" />
                                            {partner.activeAlerts} Alerts
                                        </Badge>
                                    )}

                                    <Button variant="outline" size="sm">View Details</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
