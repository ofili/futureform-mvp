import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight } from 'lucide-react';

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

    return (
        <Card className="mb-8 border-l-4 border-l-blue-600">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Next Best Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {actions.map((action, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${action.priority === 'high' ? 'bg-red-500' :
                                        action.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`} />
                                <span className="font-medium text-gray-900 dark:text-white">{action.text}</span>
                            </div>
                            <Button size="sm" variant="outline">
                                {action.action} <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
