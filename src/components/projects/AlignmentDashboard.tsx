'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Users } from 'lucide-react';

interface StakeholderScore {
    name: string;
    role: string;
    scores: Record<string, number>; // domain -> score
}

interface AlignmentDashboardProps {
    projectId: string;
    stakeholders: StakeholderScore[];
}

export default function AlignmentDashboard({ projectId, stakeholders }: AlignmentDashboardProps) {
    const domains = ['RELIABILITY', 'TRANSPARENCY', 'GOVERNANCE', 'COMPETENCE', 'INTEGRITY'];

    // Calculate alignment metrics
    const domainAnalysis = domains.map(domain => {
        const scores = stakeholders.map(s => s.scores[domain] || 0);
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const gap = max - min;

        return {
            domain,
            avg,
            gap,
            alignment: gap < 15 ? 'HIGH' : gap < 30 ? 'MEDIUM' : 'LOW'
        };
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Overall Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(domainAnalysis.filter(d => d.alignment === 'HIGH').length / domains.length * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Domains with high consensus</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Biggest Divergence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {domainAnalysis.sort((a, b) => b.gap - a.gap)[0]?.domain || 'None'}
                        </div>
                        <p className="text-xs text-muted-foreground">Requires discussion</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Participating Stakeholders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stakeholders.length}</div>
                        <p className="text-xs text-muted-foreground">Active contributors</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alignment Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {domainAnalysis.map((item) => (
                            <div key={item.domain} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium w-32">{item.domain}</span>
                                        <Badge
                                            variant={item.alignment === 'HIGH' ? 'default' : item.alignment === 'MEDIUM' ? 'secondary' : 'destructive'}
                                            className={item.alignment === 'HIGH' ? 'bg-green-100 text-green-800' : item.alignment === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                                        >
                                            {item.alignment} ALIGNMENT
                                        </Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">Gap: {Math.round(item.gap)} points</span>
                                </div>

                                {/* Visualizing individual stakeholder positions */}
                                <div className="relative h-8 bg-gray-100 rounded-full w-full mt-2">
                                    {stakeholders.map((s, i) => {
                                        const score = s.scores[item.domain] || 0;
                                        return (
                                            <div
                                                key={i}
                                                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-sm transition-all hover:scale-110 z-10"
                                                style={{
                                                    left: `${score}%`,
                                                    backgroundColor: `hsl(${i * 60}, 70%, 50%)`
                                                }}
                                                title={`${s.name} (${s.role}): ${score}`}
                                            >
                                                {s.name.charAt(0)}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 flex-wrap">
                {stakeholders.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `hsl(${i * 60}, 70%, 50%)` }}
                        />
                        <span>{s.name} ({s.role})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
