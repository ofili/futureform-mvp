'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ChartData {
  trustScores: Array<{ domain: string; score: number; confidence: number; count: number }>;
  timeSeriesData: Array<{ date: string; assessments: number; avgScore: number }>;
  riskDistribution: Array<{ severity: string; count: number; percentage: number }>;
  performanceMatrix: Array<{ partner: string; score: number; confidence: number; risk: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function InteractiveCharts({ data }: { data: ChartData }) {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const chartTypes = [
    { value: 'bar', label: 'Trust Scores', icon: BarChart3 },
    { value: 'line', label: 'Trends', icon: TrendingUp },
    { value: 'pie', label: 'Risk Distribution', icon: PieChartIcon },
    { value: 'scatter', label: 'Performance Matrix', icon: Activity }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'score' || entry.name === 'confidence' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.trustScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domain" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#8884d8" name="Average Score" />
              <Bar dataKey="confidence" fill="#82ca9d" name="Confidence" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="assessments" stroke="#8884d8" name="Assessments" />
              <Line type="monotone" dataKey="avgScore" stroke="#82ca9d" name="Avg Score" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data.riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ severity, percentage }) => `${severity} (${percentage}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {data.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data.performanceMatrix}>
              <CartesianGrid />
              <XAxis dataKey="score" name="Trust Score" />
              <YAxis dataKey="confidence" name="Confidence" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter dataKey="risk" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl">Interactive Analytics</CardTitle>

          <div className="flex flex-wrap gap-2">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={selectedChart === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedChart(type.value as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDomain} onValueChange={(value) => setSelectedDomain(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="RELIABILITY">Reliability</SelectItem>
              <SelectItem value="TRANSPARENCY">Transparency</SelectItem>
              <SelectItem value="GOVERNANCE">Governance</SelectItem>
              <SelectItem value="COMPETENCE">Competence</SelectItem>
              <SelectItem value="INTEGRITY">Integrity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}