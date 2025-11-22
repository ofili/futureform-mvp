'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, AlertTriangle, Target, Zap, Brain } from 'lucide-react';

interface Prediction {
  id: string;
  type: 'risk_trend' | 'score_forecast' | 'failure_probability' | 'improvement_timeline';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
  data: any[];
}

interface PredictiveAnalyticsProps {
  projectId: string;
  historicalData: any;
  currentAssessment: any;
}

export default function PredictiveAnalytics({ projectId, historicalData, currentAssessment }: PredictiveAnalyticsProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    generatePredictions();
  }, [projectId, selectedTimeframe]);

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/analytics/predictions/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeframe: selectedTimeframe,
          historicalData,
          currentAssessment
        })
      });
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = selectedType === 'all' 
    ? predictions 
    : predictions.filter(p => p.type === selectedType);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'risk_trend': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'score_forecast': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'failure_probability': return <Target className="h-4 w-4 text-orange-500" />;
      case 'improvement_timeline': return <Zap className="h-4 w-4 text-green-500" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictive Analytics
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
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Predictive Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Predictions</SelectItem>
                  <SelectItem value="risk_trend">Risk Trends</SelectItem>
                  <SelectItem value="score_forecast">Score Forecasts</SelectItem>
                  <SelectItem value="failure_probability">Failure Risk</SelectItem>
                  <SelectItem value="improvement_timeline">Improvements</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPredictions.map((prediction) => (
          <Card key={prediction.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getPredictionIcon(prediction.type)}
                  <div>
                    <CardTitle className="text-lg">{prediction.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{prediction.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getImpactColor(prediction.impact)}>
                    {prediction.impact} impact
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {Math.round(prediction.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  {prediction.type === 'failure_probability' ? (
                    <ScatterChart data={prediction.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="risk" />
                      <YAxis dataKey="probability" />
                      <Tooltip />
                      <Scatter dataKey="probability" fill="#ef4444" />
                    </ScatterChart>
                  ) : (
                    <LineChart data={prediction.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                      {prediction.data[0]?.confidence && (
                        <Line 
                          type="monotone" 
                          dataKey="confidence" 
                          stroke="#6b7280" 
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      )}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Timeframe: {prediction.timeframe}</span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No predictions available for the selected criteria</p>
            <Button onClick={generatePredictions} className="mt-4">
              Generate Predictions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Insights */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {predictions.filter(p => p.impact === 'high').length}
                </div>
                <div className="text-sm text-red-700">High Impact Risks</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100)}%
                </div>
                <div className="text-sm text-blue-700">Avg Confidence</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {predictions.filter(p => p.type === 'improvement_timeline').length}
                </div>
                <div className="text-sm text-green-700">Improvement Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}