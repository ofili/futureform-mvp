'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Download } from 'lucide-react';

interface SystemLog {
    id: string;
    timestamp: string;
    level: string;
    message: string;
    action?: string;
    userId?: string;
    metadata?: any;
}

interface SystemLogsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SystemLogsDialog({ open, onOpenChange }: SystemLogsDialogProps) {
    const [page, setPage] = useState(1);
    const [level, setLevel] = useState<string>('');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['system-logs', page, level, search, startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit: '50',
                ...(level && { level }),
                ...(search && { search }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
            });

            const response = await fetch(`/api/v1/admin/logs?${params}`);
            if (!response.ok) throw new Error('Failed to fetch logs');
            return response.json();
        },
        enabled: open,
    });

    const logs = data?.data?.logs || [];
    const pagination = data?.data?.pagination;

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'ERROR':
                return 'destructive';
            case 'WARN':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>System Logs</DialogTitle>
                </DialogHeader>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Levels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Levels</SelectItem>
                            <SelectItem value="INFO">INFO</SelectItem>
                            <SelectItem value="WARN">WARN</SelectItem>
                            <SelectItem value="ERROR">ERROR</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                    />

                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                    />
                </div>

                {/* Logs Table */}
                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No logs found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="sticky top-0 bg-background border-b">
                                <tr className="text-left text-sm text-muted-foreground">
                                    <th className="p-3 w-[180px]">Timestamp</th>
                                    <th className="p-3 w-[100px]">Level</th>
                                    <th className="p-3 w-[150px]">Action</th>
                                    <th className="p-3">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log: SystemLog) => (
                                    <tr key={log.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 text-sm text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant={getLevelColor(log.level) as any}>
                                                {log.level}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-sm">{log.action || '-'}</td>
                                        <td className="p-3 text-sm">{log.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {pagination && (
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
