import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface PrimaryActionModuleProps {
    totalQuestions: number;
    answeredQuestions: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    lastSaved?: Date | null;
    onContinue: () => void;
}

export default function PrimaryActionModule({
    totalQuestions,
    answeredQuestions,
    status,
    lastSaved,
    onContinue
}: PrimaryActionModuleProps) {
    const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    const statusConfig = {
        NOT_STARTED: { label: 'Not Started', color: 'bg-gray-100 text-gray-800', icon: PlayCircle },
        IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
        COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    };

    const config = statusConfig[status];
    const StatusIcon = config.icon;

    return (
        <Card className="shadow-lg border-t-4 border-t-blue-600">
            <CardHeader>
                <CardTitle className="text-xl">Your Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">
                            You have <span className="font-bold text-blue-600">{totalQuestions}</span> questions assigned
                        </p>
                        <Badge className={config.color}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {config.label}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{answeredQuestions} of {totalQuestions} answered</span>
                            <span>{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-3" />
                    </div>
                </div>

                <Button
                    onClick={onContinue}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                    {status === 'NOT_STARTED' ? 'Start Assessment' : 'Continue Assessment'}
                </Button>

                {lastSaved && (
                    <p className="text-sm text-gray-500 text-center">
                        Last Saved: {format(new Date(lastSaved), 'MMM dd, yyyy \'at\' h:mm a')}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
