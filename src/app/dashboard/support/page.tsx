'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, MessageSquare } from 'lucide-react';
import { CreateTicketModal } from '@/components/support/CreateTicketModal';
import { format } from 'date-fns';

interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
}

export default function SupportPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: tickets, isLoading, refetch } = useQuery<Ticket[]>({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await fetch('/api/v1/support/tickets');
            if (!res.ok) throw new Error('Failed to fetch tickets');
            const data = await res.json();
            return data.tickets;
        },
    });

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
            case 'HIGH': return 'text-orange-600';
            case 'MEDIUM': return 'text-yellow-600';
            case 'LOW': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support</h1>
                    <p className="text-muted-foreground">Manage your support tickets and get help.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Ticket
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Tickets</CardTitle>
                    <CardDescription>View and manage your support requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : tickets && tickets.length > 0 ? (
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm text-muted-foreground">{ticket.ticketNumber}</span>
                                            <h3 className="font-medium">{ticket.subject}</h3>
                                            <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                                                {ticket.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                                            <span>•</span>
                                            <span>{ticket.category.replace('_', ' ')}</span>
                                            <span>•</span>
                                            <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-20" />
                            <p>No tickets found. Need help? Create a new ticket.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}
