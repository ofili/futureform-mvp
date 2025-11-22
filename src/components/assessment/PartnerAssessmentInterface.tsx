'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save, Send, ArrowLeft, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  domain: string;
  text: string;
  category: string;
  evidenceRequired: string[];
}

export default function PartnerAssessmentInterface() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssessmentData();
    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchAssessmentData = async () => {
    try {
      const [assessmentRes, questionsRes] = await Promise.all([
        fetch(`/api/v1/assessments/token/${token}`),
        fetch('/api/v1/questions')
      ]);

      const assessmentData = await assessmentRes.json();
      const questionsData = await questionsRes.json();

      setAssessment(assessmentData.assessment);
      setQuestions(questionsData.questions);

      // Load existing responses
      const responsesRes = await fetch(`/api/v1/assessments/${assessmentData.assessment.id}/responses`);
      const responsesData = await responsesRes.json();
      
      const responseMap: Record<string, any> = {};
      responsesData.responses?.forEach((r: any) => {
        responseMap[r.questionId] = {
          response: r.response,
          evidence: r.evidence,
          files: r.files || []
        };
      });
      setResponses(responseMap);
    } catch (error) {
      console.error('Failed to fetch assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    if (!questions[currentQuestionIndex] || saving) return;
    
    const questionId = questions[currentQuestionIndex].id;
    const response = responses[questionId];
    
    if (response) {
      setSaving(true);
      try {
        await fetch(`/api/v1/assessments/${assessment.id}/responses/draft`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId,
            draftData: response,
            lastSaved: new Date()
          })
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const updateResponse = (questionId: string, field: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (questionId: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`/api/v1/assessments/${assessment.id}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      updateResponse(questionId, 'files', [
        ...(responses[questionId]?.files || []),
        ...data.files
      ]);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const submitResponse = async (questionId: string) => {
    try {
      await fetch(`/api/v1/assessments/${assessment.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          ...responses[questionId]
        })
      });
    } catch (error) {
      console.error('Submit response failed:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    try {
      // Submit all responses
      for (const questionId of Object.keys(responses)) {
        await submitResponse(questionId);
      }

      // Mark assessment as completed
      await fetch(`/api/v1/assessments/${assessment.id}/complete`, {
        method: 'POST'
      });

      router.push(`/assessment/${token}/completed`);
    } catch (error) {
      console.error('Submit assessment failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assessment || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p>Assessment not found or expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses[currentQuestion.id] || {};
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Trust Assessment</h1>
          <p className="text-gray-600">Project: {assessment.project?.name}</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {currentQuestion.domain}
              </div>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">{currentQuestion.text}</h3>
              
              {currentQuestion.evidenceRequired?.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Required Evidence:</h4>
                  <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                    {currentQuestion.evidenceRequired.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Response Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Response</label>
              <Textarea
                value={currentResponse.response || ''}
                onChange={(e) => updateResponse(currentQuestion.id, 'response', e.target.value)}
                placeholder="Provide your detailed response..."
                rows={4}
              />
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Supporting Evidence</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload documents, screenshots, or other evidence
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(currentQuestion.id, e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>
              
              {currentResponse.files?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Uploaded Files:</p>
                  <ul className="text-sm text-gray-600">
                    {currentResponse.files.map((file: any, index: number) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Additional Context */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Context (Optional)</label>
              <Textarea
                value={currentResponse.evidence || ''}
                onChange={(e) => updateResponse(currentQuestion.id, 'evidence', e.target.value)}
                placeholder="Any additional context or explanations..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Save className="h-3 w-3" />
                Saving...
              </span>
            )}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={submitAssessment}>
              <Send className="h-4 w-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}