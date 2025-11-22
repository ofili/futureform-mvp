'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Award, Target, Filter } from 'lucide-react';

interface BenchmarkData {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPercentile: number;
  percentile: number;
}

interface BenchmarkingDashboardProps {
  projectId: string;
  organizationType: string;
  region: string;
}

export default function BenchmarkingDashboard({ projectId, organizationType, region }: BenchmarkingDashboardProps) {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [comparisonType, setComparisonType] = useState('industry');

  useEffect(() => {
    fetchBenchmarkData();
  }, [projectId, selectedFilter, comparisonType]);

  const fetchBenchmarkData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/benchmarking/${projectId}?filter=${selectedFilter}&comparison=${comparisonType}`);
      const data = await response.json();
      setBenchmarkData(data.benchmarks);
    } catch (error) {
      console.error('Failed to fetch benchmark data:', error);
    } finally {
      setLoading(false);
    }
  };

  const radarData = benchmarkData.map(item => ({
    domain: item.category,
    yourScore: item.yourScore,
    average: item.industryAverage,
    topPercentile: item.topPercentile
  }));

  const getPerformanceLevel = (percentile: number) => {
    if (percentile >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentile >= 75) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentile >= 50) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Below Average', color: 'bg-red-100 text-red-800' };
  };

  const overallPercentile = benchmarkData.length > 0 
    ? Math.round(benchmarkData.reduce((sum, item) => sum + item.percentile, 0) / benchmarkData.length)
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Benchmarking Dashboard
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
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Benchmarking Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="region">Same Region</SelectItem>
                  <SelectItem value="type">Same Type</SelectItem>
                  <SelectItem value="size">Similar Size</SelectItem>
                </SelectContent>
              </Select>
              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industry">Industry Average</SelectItem>
                  <SelectItem value="peers">Peer Organizations</SelectItem>
                  <SelectItem value="leaders">Market Leaders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overallPercentile}th</div>
              <div className="text-sm text-gray-600">Overall Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {benchmarkData.filter(item => item.percentile >= 75).length}
              </div>
              <div className="text-sm text-gray-600">Strong Domains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {benchmarkData.filter(item => item.percentile < 50).length}
              </div>
              <div className="text-sm text-gray-600">Improvement Areas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trust Domain Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="domain" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Your Score" dataKey="yourScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Industry Average" dataKey="average" stroke="#6b7280" strokeDasharray="5 5" />
                <Radar name="Top Percentile" dataKey="topPercentile" stroke="#10b981" strokeDasharray="3 3" />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Domain Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarkData.map((item, index) => {
              const performance = getPerformanceLevel(item.percentile);
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.category}</h4>
                    <Badge className={performance.color}>
                      {performance.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Your Score</div>
                      <div className="font-semibold text-blue-600">{item.yourScore}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Industry Avg</div>
                      <div className="font-semibold">{item.industryAverage}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Top 10%</div>
                      <div className="font-semibold text-green-600">{item.topPercentile}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Percentile</div>
                      <div className="font-semibold">{item.percentile}th</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.yourScore / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yourScore" fill="#3b82f6" name="Your Score" />
                <Bar dataKey="industryAverage" fill="#6b7280" name="Industry Average" />
                <Bar dataKey="topPercentile" fill="#10b981" name="Top Percentile" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}