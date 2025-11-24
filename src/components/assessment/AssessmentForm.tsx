'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAutoSave } from '@/hooks/useAutoSave';
import { toast } from 'sonner';
import { Save, HelpCircle, CheckCircle, Clock, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FileUploader from '@/components/ui/file-uploader';

interface Question {
  id: string;
  text: string;
  helpText?: string;
  domain: string;
  order: number;
}

interface AssessmentResponseData {
  response: string;
  evidenceFiles: { name: string; url: string; type: string; size: number }[];
}

interface AssessmentFormProps {
  assessmentId: string;
  token?: string;
}

export default function AssessmentForm({ assessmentId, token }: AssessmentFormProps) {
  const [responses, setResponses] = useState<Record<string, AssessmentResponseData>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await fetch('/api/v1/questions');
      return response.json();
    }
  });

  const { data: clarificationRequests = [] } = useQuery({
    queryKey: ['clarifications', assessmentId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/assessments/${assessmentId}/clarification`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!assessmentId
  });

  // Auto-save functionality
  const { isSaving, loadDraft, clearDraft } = useAutoSave({
    data: responses,
    saveKey: `assessment_${assessmentId}`,
    onSave: async (data) => {
      const url = token
        ? `/api/v1/assessments/${token}/draft`
        : `/api/v1/assessments/${assessmentId}/draft`;

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify({ responses: data }) // Note: Backend might need update to handle complex draft data
      });
    },
    delay: 3000,
    enabled: Object.keys(responses).length > 0
  });

  const submitMutation = useMutation({
    mutationFn: async (responses: Record<string, AssessmentResponseData>) => {
      const url = token
        ? `/api/v1/assessments/${token}/responses`
        : `/api/v1/assessments/${assessmentId}/responses`;

      const formattedResponses = Object.entries(responses).map(([questionId, data]) => ({
        questionId,
        response: data.response,
        evidenceFiles: data.evidenceFiles
      }));

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify({ responses: formattedResponses })
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to submit assessment');
      }
      return res.json();
    },
    onSuccess: () => {
      clearDraft();
      toast.success('Assessment submitted successfully!');
      // Redirect or show success state
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    }
  });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Calculate completion based on both text response and evidence
  const completedResponses = Object.values(responses).filter(
    r => r.response?.trim().length > 0 && r.evidenceFiles?.length > 0
  ).length;

  if (!currentQuestion) {
    return <div className="text-center py-8">Loading questions...</div>;
  }

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        response: value,
        evidenceFiles: prev[currentQuestion.id]?.evidenceFiles || []
      }
    }));
  };

  const handleFileUpload = (files: { name: string; url: string; type: string; size: number }[]) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        response: prev[currentQuestion.id]?.response || '',
        evidenceFiles: files
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trust Assessment</h1>
            <p className="text-muted-foreground">
              Provide detailed evidence for each trust domain to generate your trust profile
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {isSaving && (
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Save className="w-4 h-4 mr-2" />
                Auto-saving...
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {completedResponses} / {questions.length} completed
              </Badge>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                ~{Math.max(1, Math.ceil((questions.length - completedResponses) * 5))} min remaining
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <Badge variant="secondary" className="self-start px-3 py-1 font-semibold tracking-wide">
                  {currentQuestion.domain.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.text}
                </CardTitle>
                {currentQuestion.helpText && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>{currentQuestion.helpText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Evidence Description Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Evidence Description
                    {responses[currentQuestion.id]?.response && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </label>
                </div>

                <Textarea
                  placeholder="Describe the evidence you are providing. Be specific about how it demonstrates compliance..."
                  value={responses[currentQuestion.id]?.response || ''}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  rows={6}
                  className="w-full text-base leading-relaxed resize-none focus-visible:ring-primary"
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Supporting Documents
                    {responses[currentQuestion.id]?.evidenceFiles?.length > 0 && (
                      <Badge variant="outline" className="text-xs font-normal bg-green-50 text-green-700 border-green-200">
                        {responses[currentQuestion.id].evidenceFiles.length} attached
                      </Badge>
                    )}
                  </label>
                  <span className="text-xs text-muted-foreground">Max 10 files</span>
                </div>

                <FileUploader
                  onUploadComplete={handleFileUpload}
                  existingFiles={responses[currentQuestion.id]?.evidenceFiles}
                  maxFiles={10}
                />
              </div>

              {/* Clarification Requests Display */}
              {clarificationRequests
                .filter((req: any) => req.assessmentResponse.questionId === currentQuestion.id)
                .map((req: any) => (
                  <div key={req.id} className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-1">Clarification Requested</h4>
                        <p className="text-sm text-yellow-700 mb-3">{req.clarificationMessage}</p>

                        {req.partnerResponse ? (
                          <div className="bg-white p-3 rounded border border-yellow-100">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Your Reply:</p>
                            <p className="text-sm">{req.partnerResponse}</p>
                            <p className="text-xs text-muted-foreground mt-2">Replied on {new Date(req.partnerRespondedAt).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Type your clarification reply here..."
                              className="bg-white"
                              id={`reply-${req.id}`}
                            />
                            <Button
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                              onClick={async () => {
                                const replyText = (document.getElementById(`reply-${req.id}`) as HTMLTextAreaElement).value;
                                if (!replyText) return;

                                try {
                                  const res = await fetch(`/api/v1/assessments/${assessmentId}/clarification`, {
                                    method: 'PATCH',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body: JSON.stringify({
                                      requestId: req.id,
                                      partnerResponse: replyText
                                    })
                                  });

                                  if (res.ok) {
                                    toast.success('Reply sent successfully');
                                    window.location.reload();
                                  }
                                } catch (e) {
                                  toast.error('Failed to send reply');
                                }
                              }}
                            >
                              Send Reply
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              size="lg"
              className="order-2 sm:order-1"
            >
              Previous Question
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
              {currentQuestionIndex === questions.length - 1 ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => submitMutation.mutate(responses)}
                    disabled={submitMutation.isPending || completedResponses < questions.length}
                    size="lg"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    {submitMutation.isPending ? 'Submitting Assessment...' : 'Submit Assessment'}
                  </Button>
                  {completedResponses < questions.length && (
                    <p className="text-xs text-red-500 text-center font-medium">
                      Complete all questions to submit
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Progress Overview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Guidance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <div className="bg-blue-50 p-3 rounded-md text-blue-800 border border-blue-100">
                  <p className="font-medium mb-1 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Evidence Quality
                  </p>
                  <p className="text-xs leading-relaxed">
                    Strong evidence includes official policies, logs, reports, and screenshots. Avoid generic statements without proof.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Checklist for this question:</p>
                  <ul className="space-y-1 list-disc list-inside text-xs">
                    <li>Detailed description provided</li>
                    <li>At least one file attached</li>
                    <li>Files are relevant and recent</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Domain Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['SYSTEM_RELIABILITY', 'OPERATIONAL_TRANSPARENCY', 'GOVERNANCE_ACCOUNTABILITY', 'ORGANIZATIONAL_COMPETENCE', 'VENDOR_INTEGRITY', 'STAKEHOLDER_ALIGNMENT'].map(domain => {
                    const domainQuestions = questions.filter(q => q.domain === domain);
                    const domainCompleted = domainQuestions.filter(q => {
                      const r = responses[q.id];
                      return r && r.response?.trim() && r.evidenceFiles?.length > 0;
                    }).length;
                    const completionRate = domainQuestions.length > 0 ? (domainCompleted / domainQuestions.length) * 100 : 0;

                    return (
                      <div key={domain} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{domain}</span>
                          <span className="text-muted-foreground">{domainCompleted}/{domainQuestions.length}</span>
                        </div>
                        <Progress value={completionRate} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}