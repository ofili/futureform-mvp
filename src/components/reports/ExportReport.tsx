'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, BarChart3, Users } from 'lucide-react';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeEvidence: boolean;
  includeRecommendations: boolean;
  sections: string[];
}

interface ExportReportProps {
  projectId?: string;
  assessmentId?: string;
  type: 'project' | 'assessment';
}

export default function ExportReport({ projectId, assessmentId, type }: ExportReportProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeEvidence: true,
    includeRecommendations: true,
    sections: ['overview', 'scores', 'analysis', 'recommendations']
  });

  const exportMutation = useMutation({
    mutationFn: async (exportOptions: ExportOptions) => {
      const endpoint = type === 'project' 
        ? `/api/v1/projects/${projectId}/export`
        : `/api/v1/assessments/${assessmentId}/export`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(exportOptions)
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  });

  const handleSectionToggle = (section: string, checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      sections: checked 
        ? [...prev.sections, section]
        : prev.sections.filter(s => s !== section)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Export Format</label>
          <Select value={options.format} onValueChange={(value: 'pdf' | 'excel' | 'csv') => 
            setOptions(prev => ({ ...prev, format: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF Report
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Excel Workbook
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  CSV Data
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Options */}
        <div>
          <label className="text-sm font-medium mb-3 block">Include Content</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={options.includeCharts}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeCharts: !!checked }))
                }
              />
              <label htmlFor="charts" className="text-sm">Charts and visualizations</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="evidence"
                checked={options.includeEvidence}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeEvidence: !!checked }))
                }
              />
              <label htmlFor="evidence" className="text-sm">Evidence and documentation</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                checked={options.includeRecommendations}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeRecommendations: !!checked }))
                }
              />
              <label htmlFor="recommendations" className="text-sm">Recommendations and insights</label>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div>
          <label className="text-sm font-medium mb-3 block">Report Sections</label>
          <div className="space-y-3">
            {[
              { id: 'overview', label: 'Executive Overview' },
              { id: 'scores', label: 'Trust Scores' },
              { id: 'analysis', label: 'Detailed Analysis' },
              { id: 'recommendations', label: 'Recommendations' },
              { id: 'appendix', label: 'Appendix' }
            ].map(section => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={options.sections.includes(section.id)}
                  onCheckedChange={(checked) => handleSectionToggle(section.id, !!checked)}
                />
                <label htmlFor={section.id} className="text-sm">{section.label}</label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => exportMutation.mutate(options)}
          disabled={exportMutation.isPending || options.sections.length === 0}
          className="w-full"
        >
          {exportMutation.isPending ? 'Generating...' : 'Export Report'}
        </Button>
      </CardContent>
    </Card>
  );
}