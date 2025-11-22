import { Card, CardContent } from '@/components/ui/card';
import { Zap, ShieldAlert, Clock } from 'lucide-react';

interface SystemHealthPanelProps {
    avgTrustScore: number;
    activeRisks: { high: number; medium: number; low: number };
    nextActionsCount: number;
}

export function SystemHealthPanel({ avgTrustScore, activeRisks, nextActionsCount }: SystemHealthPanelProps) {
    const getStatusConfig = () => {
        if (avgTrustScore < 60) return { status: 'Critical', color: 'bg-red-500', textColor: 'text-red-500' };
        if (avgTrustScore < 75) return { status: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
        return { status: 'Good', color: 'bg-green-500', textColor: 'text-green-500' };
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                System Health
            </h2>

            <Card className="mb-6 border-l-4" style={{ borderLeftColor: statusConfig.color.replace('bg-', '#') }}>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className={`${statusConfig.color} p-3 rounded-lg`}>
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Trust Health</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{statusConfig.status}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500 p-3 rounded-lg">
                                <ShieldAlert className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Risks</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {activeRisks.high}H / {activeRisks.medium}M / {activeRisks.low}L
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-red-500 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Required Actions</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{nextActionsCount} pending</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
