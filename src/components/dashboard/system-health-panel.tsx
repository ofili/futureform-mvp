import { Zap, ShieldAlert, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SystemHealthPanelProps {
    avgTrustScore: number;
    activeRisks: { high: number; medium: number; low: number };
    nextActionsCount: number;
}

export function SystemHealthPanel({ avgTrustScore, activeRisks, nextActionsCount }: SystemHealthPanelProps) {
    const getStatusConfig = () => {
        if (avgTrustScore < 60) return { status: 'Critical', color: 'bg-red-500', ringColor: 'ring-red-200', textColor: 'text-red-600' };
        if (avgTrustScore < 75) return { status: 'Attention Needed', color: 'bg-amber-500', ringColor: 'ring-amber-200', textColor: 'text-amber-600' };
        return { status: 'Good', color: 'bg-green-500', ringColor: 'ring-green-200', textColor: 'text-green-600' };
    };

    const statusConfig = getStatusConfig();
    const totalRisks = activeRisks.high + activeRisks.medium + activeRisks.low;

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/30">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    System Health
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                {/* Overall Health Score */}
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${statusConfig.color} ring-4 ${statusConfig.ringColor} flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{avgTrustScore}</span>
                    </div>
                    <div>
                        <p className={`font-semibold ${statusConfig.textColor}`}>{statusConfig.status}</p>
                        <p className="text-sm text-gray-500">Trust Score</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100"></div>

                {/* Risk Breakdown */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Active Risks</span>
                        <span className="text-sm text-gray-500">{totalRisks} total</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-red-600">{activeRisks.high}</p>
                            <p className="text-xs text-red-600 font-medium">High</p>
                        </div>
                        <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-amber-600">{activeRisks.medium}</p>
                            <p className="text-xs text-amber-600 font-medium">Medium</p>
                        </div>
                        <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-blue-600">{activeRisks.low}</p>
                            <p className="text-xs text-blue-600 font-medium">Low</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100"></div>

                {/* Pending Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{nextActionsCount} Actions Required</p>
                            <p className="text-xs text-gray-500">Items need your attention</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                        View <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
