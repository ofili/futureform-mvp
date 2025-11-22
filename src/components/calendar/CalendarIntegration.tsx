'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Bell, Users, Video } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  type: 'assessment_deadline' | 'review_meeting' | 'stakeholder_call';
  entityId: string;
  reminderSet: boolean;
}

interface CalendarIntegrationProps {
  projectId: string;
}

export default function CalendarIntegration({ projectId }: CalendarIntegrationProps) {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'assessment_deadline' as const
  });

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['calendar-events', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/calendar/events/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  const createEventMutation = useMutation({
    mutationFn: async (event: typeof newEvent) => {
      const response = await fetch(`/api/v1/calendar/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...event, projectId })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events', projectId] });
      setShowCreateEvent(false);
      setNewEvent({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: 'assessment_deadline'
      });
    }
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'assessment_deadline':
        return <Clock className="w-4 h-4 text-red-500" />;
      case 'review_meeting':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'stakeholder_call':
        return <Video className="w-4 h-4 text-green-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'assessment_deadline':
        return 'border-l-red-500 bg-red-50';
      case 'review_meeting':
        return 'border-l-blue-500 bg-blue-50';
      case 'stakeholder_call':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const upcomingEvents = events.filter(event => isUpcoming(event.startTime));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar & Deadlines
          </span>
          <Button size="sm" onClick={() => setShowCreateEvent(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Create Event Form */}
        {showCreateEvent && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Schedule New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="assessment_deadline">Assessment Deadline</option>
                  <option value="review_meeting">Review Meeting</option>
                  <option value="stakeholder_call">Stakeholder Call</option>
                </select>
              </div>
              
              <Input
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => createEventMutation.mutate(newEvent)}
                  disabled={!newEvent.title || !newEvent.startTime || createEventMutation.isPending}
                >
                  {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCreateEvent(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Upcoming Events ({upcomingEvents.length})
          </h3>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming events</p>
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const startDateTime = formatDateTime(event.startTime);
              const endDateTime = formatDateTime(event.endTime);
              
              return (
                <div
                  key={event.id}
                  className={`p-4 border-l-4 rounded-r-lg ${getEventColor(event.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getEventIcon(event.type)}
                      <div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{startDateTime.date}</span>
                          <span>{startDateTime.time} - {endDateTime.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}