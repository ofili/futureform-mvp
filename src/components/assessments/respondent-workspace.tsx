'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RespondentWorkspaceProps {
    assessmentId: string;
}

export default function RespondentWorkspace({ assessmentId }: RespondentWorkspaceProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [assessment, setAssessment] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAssessmentData();
    }, [assessmentId]);

    const fetchAssessmentData = async () => {
        try {
            // Fetch assessment and assigned questions
            const response = await fetch(`/api/v1/assessments/${assessmentId}/my-questions`);
            const data = await response.json();

            setAssessment(data.assessment);
            setQuestions(data.questions);

            // Fetch existing responses
            const responsesRes = await fetch(`/api/v1/assessments/${assessmentId}/my-responses`);
            const responsesData = await responsesRes.json();

            const responsesMap: Record<string, any> = {};
            responsesData.responses.forEach((r: any) => {
                responsesMap[r.questionId] = r;
            });
            setResponses(responsesMap);
        } catch (error) {
            console.error('Error fetching assessment data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveResponse = async (questionId: string, answer: string) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/v1/responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId,
                    questionId,
                    answer,
                }),
            });

            const data = await response.json();
            setResponses((prev) => ({
                ...prev,
                [questionId]: data.response,
            }));
        } catch (error) {
            console.error('Error saving response:', error);
            toast.error('Failed to save response');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (questionId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('responseId', responses[questionId]?.id);

        try {
            const response = await fetch('/api/v1/evidence', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            // Refresh responses to get updated evidence
            await fetchAssessmentData();
            toast.success('Evidence uploaded successfully');
        } catch (error) {
            console.error('Error uploading evidence:', error);
            toast.error('Failed to upload evidence');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentResponse = currentQuestion ? responses[currentQuestion.questionId] : null;
    const progress = (Object.keys(responses).length / questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{assessment?.project?.name}</h1>
                <p className="text-muted-foreground">Complete your assigned questions</p>
                {assessment?.deadline && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Deadline: {new Date(assessment.deadline).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Progress */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                            {Object.keys(responses).length} of {questions.length} completed
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </CardContent>
            </Card>

            {/* Question Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {questions.map((q, index) => (
                    <Button
                        key={q.id}
                        variant={currentQuestionIndex === index ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentQuestionIndex(index)}
                        className="shrink-0"
                    >
                        {responses[q.questionId] ? (
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                        ) : null}
                        Q{index + 1}
                    </Button>
                ))}
            </div>

            {/* Current Question */}
            {currentQuestion && (
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{currentQuestion.question.domain}</Badge>
                                    {currentQuestion.role && (
                                        <Badge variant="secondary">{currentQuestion.role.name}</Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl">
                                    {currentQuestion.question.text}
                                </CardTitle>
                            </div>
                        </div>
                        {currentQuestion.question.helpText && (
                            <p className="text-sm text-muted-foreground mt-2">
                                {currentQuestion.question.helpText}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Answer Input */}
                        <div className="space-y-2">
                            <Label htmlFor="answer">Your Answer</Label>
                            <Textarea
                                id="answer"
                                placeholder="Type your answer here..."
                                rows={6}
                                defaultValue={currentResponse?.answer || ''}
                                onBlur={(e) => {
                                    if (e.target.value !== currentResponse?.answer) {
                                        handleSaveResponse(currentQuestion.questionId, e.target.value);
                                    }
                                }}
                            />
                            {isSaving && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </p>
                            )}
                        </div>

                        {/* Evidence Upload */}
                        {currentQuestion.evidenceRequirements?.length > 0 && (
                            <div className="space-y-2">
                                <Label>Required Evidence</Label>
                                <div className="bg-muted/50 p-3 rounded space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Please upload the following types of evidence:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {currentQuestion.evidenceRequirements.map((evidence: string) => (
                                            <Badge key={evidence} variant="outline">
                                                {evidence}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {currentResponse && (
                                    <div className="space-y-2">
                                        <Button variant="outline" asChild className="w-full">
                                            <label className="cursor-pointer">
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Evidence
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            handleFileUpload(currentQuestion.questionId, file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </Button>

                                        {/* Uploaded Evidence */}
                                        {currentResponse.evidenceUploads?.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Uploaded Evidence:</p>
                                                {currentResponse.evidenceUploads.map((evidence: any) => (
                                                    <div
                                                        key={evidence.id}
                                                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4" />
                                                            <span className="text-sm">{evidence.fileName}</span>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                evidence.verificationStatus === 'APPROVED'
                                                                    ? 'default'
                                                                    : evidence.verificationStatus === 'REJECTED'
                                                                        ? 'destructive'
                                                                        : 'secondary'
                                                            }
                                                        >
                                                            {evidence.verificationStatus}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>
                <Button
                    onClick={() =>
                        setCurrentQuestionIndex(
                            Math.min(questions.length - 1, currentQuestionIndex + 1)
                        )
                    }
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
