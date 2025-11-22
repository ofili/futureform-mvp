import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: ReactNode;
    variant?: 'default' | 'primary' | 'warning' | 'danger';
}

export function StatCard({ title, value, icon: Icon, description, trend, variant = 'default' }: StatCardProps) {
    const variantStyles = {
        default: 'hover:shadow-lg',
        primary: 'border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900',
        warning: 'border-2 border-orange-200 dark:border-orange-900',
        danger: 'border-2 border-red-300 dark:border-red-800'
    };

    const iconColors = {
        default: 'text-gray-600',
        primary: 'text-blue-600',
        warning: 'text-orange-500',
        danger: 'text-red-500'
    };

    const valueColors = {
        default: 'text-gray-900 dark:text-white',
        primary: 'text-blue-600',
        warning: 'text-orange-600',
        danger: 'text-red-600'
    };

    return (
        <Card className={`transition-shadow ${variantStyles[variant]}`}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
                    <Icon className={`h-5 w-5 ${iconColors[variant]}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-4xl font-bold mb-2 ${valueColors[variant]}`}>{value}</div>
                {trend && <div className="flex items-center gap-2 mb-2">{trend}</div>}
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </CardContent>
        </Card>
    );
}
