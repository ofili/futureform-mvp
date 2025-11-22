'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertTriangle, XCircle, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ValidationService } from '@/lib/services/validationService';

interface Response {
    id: string;
    question: { text: string; domain: string };
    response: string;
    evidence: string | null;
    validationStatus: string;
}

interface EvidenceValidationProps {
    assessmentId: string;
    responses: Response[];
    onValidationComplete: () => void;
}

export default function EvidenceValidation({ assessmentId, responses, onValidationComplete }: EvidenceValidationProps) {
    const [validating, setValidating] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [clarifying, setClarifying] = useState<string | null>(null);
    const [clarificationMessage, setClarificationMessage] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleValidate = async (responseId: string, status: 'VALIDATED' | 'REJECTED' | 'FLAGGED') => {
        try {
            const res = await fetch(`/api/v1/assessments/${assessmentId}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    responseId,
                    status,
                    notes
                })
            });

            if (!res.ok) throw new Error('Validation failed');

            toast.success(`Response marked as ${status}`);
            setValidating(null);
            setNotes('');
            onValidationComplete();
        } catch (error) {
            toast.error('Failed to update validation status');
        }
    };

    const handleRequestClarification = async (responseId: string) => {
        if (!clarificationMessage || !deadline) {
            toast.error('Please provide a message and deadline');
            return;
        }

        try {
            const res = await fetch(`/api/v1/assessments/${assessmentId}/clarification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    responseId,
                    message: clarificationMessage,
                    deadline
                })
            });

            if (!res.ok) throw new Error('Failed to send request');

            toast.success('Clarification request sent');
            setClarifying(null);
            setClarificationMessage('');
            setDeadline('');
            onValidationComplete();
        } catch (error) {
            toast.error('Failed to send clarification request');
        }
    };

    return (
        <div className="space-y-6">
            {responses.map((item) => (
                <Card key={item.id} className={`border-l-4 ${item.validationStatus === 'FLAGGED' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge variant="outline" className="mb-2">{item.question.domain}</Badge>
                                <CardTitle className="text-base">{item.question.text}</CardTitle>
                            </div>
                            <Badge
                                variant={
                                    item.validationStatus === 'VALIDATED' ? 'default' :
                                        item.validationStatus === 'REJECTED' ? 'destructive' :
                                            item.validationStatus === 'FLAGGED' ? 'secondary' : 'secondary'
                                }
                                className={item.validationStatus === 'FLAGGED' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                            >
                                {item.validationStatus}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 p-4 rounded-md mb-4">
                            <p className="text-sm font-medium mb-1">Partner Response:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{item.response}</p>
                            {item.evidence && (
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                                        <FileText className="w-4 h-4" />
                                        <a href="#" className="hover:underline">View Evidence File</a>
                                    </div>

                                    {/* AI Validation Insights */}
                                    {(() => {
                                        const mockFile = {
                                            name: item.evidence.includes('.') ? item.evidence : 'evidence.pdf',
                                            size: 2 * 1024 * 1024,
                                            type: 'application/pdf'
                                        };
                                        const validation = ValidationService.validateEvidence(mockFile);

                                        return (
                                            <div className="bg-purple-50 border border-purple-100 rounded p-3 flex items-start gap-3">
                                                <Sparkles className="w-4 h-4 text-purple-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-purple-800">AI Validation Insight</span>
                                                        <Badge variant="outline" className={`text-xs ${validation.score > 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                            {validation.score}% Confidence
                                                        </Badge>
                                                    </div>
                                                    {validation.flags.length > 0 ? (
                                                        <ul className="text-xs text-purple-700 list-disc list-inside">
                                                            {validation.flags.map((flag, i) => (
                                                                <li key={i}>{flag}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-purple-700">No issues detected. Evidence appears valid.</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Clarification Request Form */}
                        {clarifying === item.id ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                                <h4 className="text-sm font-semibold text-yellow-800">Request Clarification</h4>
                                <Textarea
                                    placeholder="What needs clarification? Be specific."
                                    value={clarificationMessage}
                                    onChange={(e) => setClarificationMessage(e.target.value)}
                                    className="bg-white"
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-yellow-800">Response Deadline</label>
                                    <input
                                        type="date"
                                        className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => setClarifying(null)}>Cancel</Button>
                                    <Button
                                        size="sm"
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                        onClick={() => handleRequestClarification(item.id)}
                                    >
                                        Send Request
                                    </Button>
                                </div>
                            </div>
                        ) : null}

                        {validating === item.id ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <Textarea
                                    placeholder="Add validation notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => setValidating(null)}>Cancel</Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                        onClick={() => {
                                            setValidating(null);
                                            setClarifying(item.id);
                                        }}
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Request Clarification
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleValidate(item.id, 'REJECTED')}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleValidate(item.id, 'VALIDATED')}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Validate
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            !clarifying && (
                                <div className="flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => setValidating(item.id)}>
                                        Review & Validate
                                    </Button>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
