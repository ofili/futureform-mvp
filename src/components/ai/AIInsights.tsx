'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
}

interface AIInsightsProps {
  projectId: string;
  assessmentData: any;
}

export default function AIInsights({ projectId, assessmentData }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    generateInsights();
  }, [projectId, assessmentData]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/ai/insights/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentData })
      });
      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = selectedType === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedType);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'pattern': return <Target className="h-4 w-4 text-purple-500" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
          <Badge variant="secondary" className="ml-auto">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="risk">Risks</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
            <TabsTrigger value="pattern">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="mt-4">
            <div className="space-y-4">
              {filteredInsights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                              {insight.impact} impact
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                      {insight.actionable && (
                        <Button size="sm" variant="outline" className="ml-4">
                          <Zap className="h-3 w-3 mr-1" />
                          Act
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredInsights.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {selectedType === 'all' ? '' : selectedType} insights available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button onClick={generateInsights} disabled={loading} className="w-full">
            <Brain className="h-4 w-4 mr-2" />
            Regenerate Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}