import { Badge } from '@/components/ui/badge';

type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'in_progress' | 'expired' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
    status: Status;
    label?: string;
}

const statusConfig: Record<Status, { variant: any; label: string }> = {
    active: { variant: 'default', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    pending: { variant: 'outline', label: 'Pending' },
    completed: { variant: 'default', label: 'Completed' },
    in_progress: { variant: 'secondary', label: 'In Progress' },
    expired: { variant: 'destructive', label: 'Expired' },
    success: { variant: 'default', label: 'Success' },
    warning: { variant: 'secondary', label: 'Warning' },
    error: { variant: 'destructive', label: 'Error' }
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
    const config = statusConfig[status];
    const displayLabel = label || config.label;

    return (
        <Badge variant={config.variant} className={status === 'active' || status === 'completed' || status === 'success' ? 'bg-green-600' : ''}>
            {displayLabel}
        </Badge>
    );
}
