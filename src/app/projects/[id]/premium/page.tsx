'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AIInsights from '@/components/ai/AIInsights';
import BenchmarkingDashboard from '@/components/benchmarking/BenchmarkingDashboard';
import CustomReportBuilder from '@/components/reports/CustomReportBuilder';
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';
import { Brain, Target, FileText, TrendingUp, Crown } from 'lucide-react';

export default function PremiumFeaturesPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, assessmentRes] = await Promise.all([
        fetch(`/api/v1/projects/${projectId}`),
        fetch(`/api/v1/assessments?projectId=${projectId}`)
      ]);

      const projectData = await projectRes.json();
      const assessmentData = await assessmentRes.json();

      setProject(projectData.project);
      setAssessmentData(assessmentData.assessments);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Premium Analytics</h1>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            Enterprise
          </Badge>
        </div>
        <p className="text-gray-600">
          Advanced AI-powered insights, benchmarking, and predictive analytics for {project?.name}
        </p>
      </div>

      {/* Premium Features Tabs */}
      <Tabs defaultValue="ai-insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="benchmarking" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Benchmarking
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Custom Reports
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-insights">
          <AIInsights 
            projectId={projectId} 
            assessmentData={assessmentData}
          />
        </TabsContent>

        <TabsContent value="benchmarking">
          <BenchmarkingDashboard 
            projectId={projectId}
            organizationType={project?.organizationType || 'startup'}
            region={project?.region || 'africa'}
          />
        </TabsContent>

        <TabsContent value="reports">
          <CustomReportBuilder 
            projectId={projectId}
            assessmentData={assessmentData}
          />
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveAnalytics 
            projectId={projectId}
            historicalData={assessmentData}
            currentAssessment={assessmentData?.[0]}
          />
        </TabsContent>
      </Tabs>

      {/* Feature Overview Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-blue-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Machine learning-powered risk detection, pattern analysis, and actionable recommendations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-green-500" />
              Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Compare performance against industry standards, peers, and market leaders
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-purple-500" />
              Custom Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Build tailored reports with drag-and-drop sections and multiple export formats
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Forecast trends, predict risks, and model improvement scenarios
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}