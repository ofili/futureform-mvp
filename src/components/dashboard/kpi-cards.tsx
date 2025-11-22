import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, Activity, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
    avgTrustScore: number;
    totalProjects: number;
    activeAssessments: number;
    creditsRemaining: number;
}

export function KPICards({ avgTrustScore, totalProjects, activeAssessments, creditsRemaining }: KPICardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Average Trust Score */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Trust Score</CardTitle>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-blue-600 mb-2">{avgTrustScore}%</div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">+3% vs last month</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Total Projects */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</CardTitle>
                        <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{totalProjects}</div>
                    <p className="text-xs text-gray-500">Assessment projects</p>
                </CardContent>
            </Card>

            {/* Active Assessments */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Assessments</CardTitle>
                        <Activity className="h-5 w-5 text-orange-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-orange-600 mb-2">{activeAssessments}</div>
                    <p className="text-xs text-gray-500">In progress</p>
                </CardContent>
            </Card>

            {/* Credits */}
            <Card className={`hover:shadow-lg transition-shadow ${creditsRemaining < 5 ? 'border-2 border-red-300 dark:border-red-800' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Credits</CardTitle>
                        <AlertTriangle className={`h-5 w-5 ${creditsRemaining < 5 ? 'text-red-500' : 'text-blue-500'}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={`text-4xl font-bold mb-2 ${creditsRemaining < 5 ? 'text-red-600' : 'text-blue-600'}`}>
                        {creditsRemaining}
                    </div>
                    {creditsRemaining < 5 && (
                        <Button variant="link" className="text-xs text-red-600 p-0 h-auto">
                            Purchase more →
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
