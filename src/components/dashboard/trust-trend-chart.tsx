import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
    month: string;
    avgScore: number;
}

interface TrustTrendChartProps {
    data: MonthlyData[];
}

export function TrustTrendChart({ data }: TrustTrendChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Trust Score Trend</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Average scores over time
                </p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis domain={[60, 85]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="avgScore" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
