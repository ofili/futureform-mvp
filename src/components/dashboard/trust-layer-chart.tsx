import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface TrustLayerData {
    layer: string;
    score: number;
    benchmark: number;
}

interface TrustLayerChartProps {
    data: TrustLayerData[];
}

const getBarColor = (score: number) => {
    if (score < 50) return '#EF4444';
    if (score < 70) return '#F59E0B';
    return '#10B981';
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const benchmark = payload.find((p: any) => p.dataKey === 'benchmark')?.value;
        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-semibold mb-1">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Score: {data.value}%</p>
                {benchmark && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {data.value >= benchmark ? '↑' : '↓'} {Math.abs(data.value - benchmark)}% vs benchmark
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export function TrustLayerChart({ data }: TrustLayerChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Trust Layer Performance</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Domain scores vs industry benchmark
                </p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="layer" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={75} stroke="#9ca3af" strokeDasharray="3 3" label="Benchmark" />
                        <Bar dataKey="score" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
