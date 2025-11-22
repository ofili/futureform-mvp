'use client';

import { useState } from 'react';
import { WizardData } from './assessment-wizard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, X } from 'lucide-react';

interface QuestionSelectionStepProps {
    data: WizardData;
    onUpdate: (data: Partial<WizardData>) => void;
    isLoading: boolean;
}

export default function QuestionSelectionStep({
    data,
    onUpdate,
    isLoading,
}: QuestionSelectionStepProps) {
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
        data.selectedQuestions.map((q) => q.id)
    );

    const toggleQuestion = (questionId: string) => {
        const newSelection = selectedQuestionIds.includes(questionId)
            ? selectedQuestionIds.filter((id) => id !== questionId)
            : [...selectedQuestionIds, questionId];

        setSelectedQuestionIds(newSelection);

        const updatedQuestions = data.selectedQuestions.filter((q) =>
            newSelection.includes(q.id)
        );
        onUpdate({ selectedQuestions: updatedQuestions });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI is selecting questions...</h3>
                <p className="text-muted-foreground text-center max-w-md">
                    Our AI is analyzing your requirements and selecting the most relevant questions
                    for your assessment.
                </p>
            </div>
        );
    }

    if (data.selectedQuestions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">
                    Click "Next" to generate AI-selected questions
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">
                    AI Selected {data.selectedQuestions.length} Questions
                </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                Review and customize the questions selected by our AI. You can remove questions
                that aren't relevant or keep all suggestions.
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {data.selectedQuestions.map((question, index) => (
                    <Card key={question.id} className="p-4">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                checked={selectedQuestionIds.includes(question.id)}
                                onCheckedChange={() => toggleQuestion(question.id)}
                                className="mt-1"
                            />

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground mr-2">
                                            Q{index + 1}
                                        </span>
                                        <span className="font-medium">{question.question.text}</span>
                                    </div>
                                    <Badge variant="secondary" className="shrink-0">
                                        {Math.round(question.aiConfidence * 100)}% match
                                    </Badge>
                                </div>

                                {question.question.helpText && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {question.question.helpText}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                        {question.question.domain}
                                    </Badge>
                                    {question.role && (
                                        <Badge variant="outline" className="text-xs">
                                            {question.role.name}
                                        </Badge>
                                    )}
                                    {question.assignedSeniority && (
                                        <Badge variant="outline" className="text-xs">
                                            {question.assignedSeniority}
                                        </Badge>
                                    )}
                                </div>

                                {question.aiRationale && (
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                        💡 {question.aiRationale}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                    {selectedQuestionIds.length} of {data.selectedQuestions.length} questions
                    selected
                </p>
            </div>
        </div>
    );
}
