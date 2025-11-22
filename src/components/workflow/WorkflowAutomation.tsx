'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Workflow, Play, Pause, Settings, CheckCircle, Clock } from 'lucide-react';

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  conditions: Array<{ field: string; operator: string; value: string }>;
  actions: Array<{ type: string; config: Record<string, any> }>;
  active: boolean;
  lastRun?: string;
  runCount: number;
}

interface WorkflowAutomationProps {
  projectId: string;
}

export default function WorkflowAutomation({ projectId }: WorkflowAutomationProps) {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery<WorkflowRule[]>({
    queryKey: ['workflow-rules', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/workflow/rules/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, active }: { ruleId: string; active: boolean }) => {
      const response = await fetch(`/api/v1/workflow/rules/${ruleId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ active })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-rules', projectId] });
    }
  });

  const getStatusIcon = (rule: WorkflowRule) => {
    if (!rule.active) return <Pause className="w-4 h-4 text-gray-500" />;
    if (rule.lastRun) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const predefinedRules = [
    {
      name: 'Auto-approve high trust scores',
      trigger: 'assessment_completed',
      conditions: [{ field: 'trust_score', operator: 'gte', value: '85' }],
      actions: [{ type: 'approve_assessment', config: {} }]
    },
    {
      name: 'Flag low scores for review',
      trigger: 'assessment_completed',
      conditions: [{ field: 'trust_score', operator: 'lt', value: '60' }],
      actions: [{ type: 'request_review', config: { reviewers: ['admin'] } }]
    },
    {
      name: 'Notify on red flags',
      trigger: 'red_flag_detected',
      conditions: [{ field: 'severity', operator: 'in', value: 'HIGH,CRITICAL' }],
      actions: [{ type: 'send_notification', config: { channels: ['email'] } }]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Workflow Automation
          </span>
          <Button className="h-8 px-3 text-sm" onClick={() => setSelectedRule('new')}>
            <Settings className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Setup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predefinedRules.map((rule, index) => (
            <Card key={index} className="border-dashed">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2">{rule.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  When {rule.trigger.replace('_', ' ')} → {rule.actions[0].type.replace('_', ' ')}
                </p>
                <Button className="h-8 px-3 text-sm w-full border border-gray-300 bg-white hover:bg-gray-50">
                  Add Rule
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Rules */}
        <div className="space-y-3">
          <h3 className="font-medium">Active Rules ({rules.filter(r => r.active).length})</h3>
          
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Workflow className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No workflow rules configured</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(rule)}
                  <div>
                    <h4 className="font-medium text-sm">{rule.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>Trigger: {rule.trigger.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Runs: {rule.runCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={rule.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                    {rule.active ? 'Active' : 'Paused'}
                  </Badge>
                  
                  <Button
                    className="h-8 px-2 bg-transparent hover:bg-gray-100"
                    onClick={() => toggleRuleMutation.mutate({ 
                      ruleId: rule.id, 
                      active: !rule.active 
                    })}
                  >
                    {rule.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rule Builder */}
        {selectedRule === 'new' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Create New Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select>
                  <option value="">Select trigger</option>
                  <option value="assessment_completed">Assessment Completed</option>
                  <option value="red_flag_detected">Red Flag Detected</option>
                </Select>
                
                <Select>
                  <option value="">Select condition</option>
                  <option value="trust_score_gte_80">Trust Score ≥ 80%</option>
                  <option value="trust_score_lt_60">Trust Score &lt; 60%</option>
                </Select>
                
                <Select>
                  <option value="">Select action</option>
                  <option value="send_notification">Send Notification</option>
                  <option value="request_review">Request Review</option>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button className="h-8 px-3 text-sm">Create Rule</Button>
                <Button className="h-8 px-3 text-sm border border-gray-300 bg-white hover:bg-gray-50" onClick={() => setSelectedRule(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}