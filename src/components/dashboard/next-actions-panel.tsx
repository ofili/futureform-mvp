import { Button } from '@/components/ui/button';
import { Target, ArrowRight, MoreHorizontal, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface NextAction {
    text: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
}

interface NextActionsPanelProps {
    actions: NextAction[];
}

export function NextActionsPanel({ actions }: NextActionsPanelProps) {
    if (actions.length === 0) return null;

    const getPriorityConfig = (priority: NextAction['priority']) => {
        switch (priority) {
            case 'high':
                return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' };
            case 'medium':
                return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' };
            case 'low':
                return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' };
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/30">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Next Best Actions
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
            </div>

            {/* Actions List */}
            <div className="divide-y">
                {actions.map((action, idx) => {
                    const config = getPriorityConfig(action.priority);
                    const Icon = config.icon;

                    return (
                        <div
                            key={idx}
                            className={`flex items-center gap-3 p-4 border-l-4 ${config.border} hover:bg-gray-50 transition-colors`}
                        >
                            <div className={`p-2 rounded-lg ${config.bg}`}>
                                <Icon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{action.text}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                {action.action}
                                <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-gray-50/30 text-center">
                <Button variant="ghost" size="sm" className="text-gray-500">
                    View all recommendations
                </Button>
            </div>
        </div>
    );
}
