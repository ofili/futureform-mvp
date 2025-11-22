'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SupportTicket {
    id: string;
    ticketNumber: string;
    subject: string;
    category: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    assignedTo?: {
        firstName: string;
        lastName: string;
    };
}

export default function SupportTicketsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
        queryKey: ['admin-support-tickets'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/support/tickets');
            const result = await response.json();
            return result.data;
        },
    });

    const filteredTickets = tickets?.filter((ticket) =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'RESOLVED': return 'bg-green-100 text-green-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-600 font-bold';
            case 'HIGH': return 'text-orange-600 font-medium';
            case 'MEDIUM': return 'text-blue-600';
            case 'LOW': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage and respond to user inquiries.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Tickets</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tickets..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredTickets?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No tickets found matching your search.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ticket ID</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTickets?.map((ticket) => (
                                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/admin/support/${ticket.id}`)}>
                                            <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{ticket.subject}</div>
                                                <div className="text-xs text-muted-foreground">{ticket.category}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{ticket.user.firstName} {ticket.user.lastName}</div>
                                                <div className="text-xs text-muted-foreground">{ticket.user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                                                    {ticket.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`flex items-center gap-1 text-xs ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority === 'URGENT' && <AlertCircle className="w-3 h-3" />}
                                                    {ticket.priority}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
