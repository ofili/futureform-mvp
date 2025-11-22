'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export default function Support() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM' as const
  });

  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const response = await fetch('/api/v1/support/tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/v1/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      setShowForm(false);
      setFormData({ subject: '', description: '', priority: 'MEDIUM' });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <MessageCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />;
      case 'RESOLVED':
      case 'CLOSED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'RESOLVED':
        return 'outline';
      case 'CLOSED':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'outline';
      case 'MEDIUM':
        return 'secondary';
      case 'HIGH':
        return 'default';
      case 'URGENT':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Support</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              createTicketMutation.mutate(formData);
            }} className="space-y-4">
              <div>
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Describe your issue..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                />
              </div>
              <div>
                <Select value={formData.priority} onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low Priority</SelectItem>
                    <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                    <SelectItem value="HIGH">High Priority</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={createTicketMutation.isPending}>
                  {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No support tickets yet</p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="font-semibold">{ticket.subject}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Badge variant={getStatusColor(ticket.status) as any}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getPriorityColor(ticket.priority) as any}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}