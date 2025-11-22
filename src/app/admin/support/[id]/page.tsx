'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, User, Lock, Clock, Check, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TicketMessage {
    id: string;
    message: string;
    isInternal: boolean;
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

interface SupportTicket {
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    category: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    messages: TicketMessage[];
}

export default function TicketDetailPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const [replyMessage, setReplyMessage] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const ticketId = params?.id as string;

    const { data: ticket, isLoading } = useQuery<SupportTicket>({
        queryKey: ['admin-support-ticket', ticketId],
        queryFn: async () => {
            const response = await fetch(`/api/v1/admin/support/tickets/${ticketId}`);
            if (!response.ok) throw new Error('Failed to fetch ticket');
            const result = await response.json();
            return result.data;
        },
        enabled: !!ticketId,
    });

    const replyMutation = useMutation({
        mutationFn: async (data: { message: string; isInternal: boolean }) => {
            const response = await fetch(`/api/v1/admin/support/tickets/${ticketId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send reply');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-support-ticket', ticketId] });
            setReplyMessage('');
            toast.success('Reply sent successfully');
        },
        onError: () => {
            toast.error('Failed to send reply');
        },
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [ticket?.messages]);

    const handleReply = () => {
        if (!replyMessage.trim()) return;
        replyMutation.mutate({ message: replyMessage, isInternal });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Ticket not found</h2>
                <Button variant="link" onClick={() => router.push('/admin/support')}>
                    Return to Ticket List
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/support')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
                        <Badge variant="outline">#{ticket.ticketNumber}</Badge>
                        <Badge className={
                            ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                                ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                    ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {ticket.user.firstName} {ticket.user.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                        <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Priority: {ticket.priority}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Conversation Thread */}
                <Card className="lg:col-span-2 flex flex-col h-full border-0 shadow-none bg-transparent">
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-white rounded-lg border shadow-sm mb-4">
                        {/* Original Ticket Description */}
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-blue-700">
                                    {ticket.user.firstName[0]}{ticket.user.lastName[0]}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm">{ticket.user.firstName} {ticket.user.lastName}</span>
                                    <span className="text-xs text-muted-foreground">{format(new Date(ticket.createdAt), 'MMM d, h:mm a')}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg text-sm whitespace-pre-wrap border">
                                    {ticket.description}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Messages */}
                        {ticket.messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.isInternal ? 'bg-yellow-50/50 -mx-4 px-4 py-2 border-l-2 border-yellow-400' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    <span className="text-xs font-bold">
                                        {msg.user.firstName[0]}{msg.user.lastName[0]}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{msg.user.firstName} {msg.user.lastName}</span>
                                            {msg.user.role === 'ADMIN' && <Badge variant="secondary" className="text-[10px] h-4">Staff</Badge>}
                                            {msg.isInternal && <Badge variant="outline" className="text-[10px] h-4 border-yellow-500 text-yellow-700 bg-yellow-50"><Lock className="w-2 h-2 mr-1" /> Internal Note</Badge>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{format(new Date(msg.createdAt), 'MMM d, h:mm a')}</span>
                                    </div>
                                    <div className="text-sm whitespace-pre-wrap">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Reply Area */}
                    <Card className="flex-shrink-0">
                        <CardContent className="p-4">
                            <Textarea
                                placeholder="Type your reply..."
                                className="min-h-[100px] mb-4 resize-none"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={isInternal ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsInternal(!isInternal)}
                                        className={isInternal ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "text-muted-foreground"}
                                    >
                                        <Lock className="w-3 h-3 mr-2" />
                                        Internal Note
                                    </Button>
                                </div>
                                <Button onClick={handleReply} disabled={!replyMessage.trim() || replyMutation.isPending}>
                                    {replyMutation.isPending ? 'Sending...' : (
                                        <>
                                            <Send className="w-3 h-3 mr-2" />
                                            Send Reply
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Ticket Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block mb-1">Category</span>
                                <span className="font-medium">{ticket.category}</span>
                            </div>
                            <Separator />
                            <div>
                                <span className="text-muted-foreground block mb-1">User Email</span>
                                <span className="font-medium">{ticket.user.email}</span>
                            </div>
                            <Separator />
                            <div>
                                <span className="text-muted-foreground block mb-1">Ticket ID</span>
                                <span className="font-mono text-xs">{ticket.id}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Resolved
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Close Ticket
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
