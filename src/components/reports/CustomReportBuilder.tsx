'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, Settings, Plus, Trash2 } from 'lucide-react';

interface ReportSection {
  id: string;
  type: 'summary' | 'scores' | 'evidence' | 'recommendations' | 'benchmarks' | 'charts';
  title: string;
  enabled: boolean;
  config: any;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  format: 'pdf' | 'excel' | 'powerpoint';
}

interface CustomReportBuilderProps {
  projectId: string;
  assessmentData: any;
}

export default function CustomReportBuilder({ projectId, assessmentData }: CustomReportBuilderProps) {
  const [reportName, setReportName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadTemplates();
    initializeDefaultSections();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/v1/reports/templates');
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const initializeDefaultSections = () => {
    const defaultSections: ReportSection[] = [
      {
        id: '1',
        type: 'summary',
        title: 'Executive Summary',
        enabled: true,
        config: { includeKeyFindings: true, includeRecommendations: true }
      },
      {
        id: '2',
        type: 'scores',
        title: 'Trust Scores Overview',
        enabled: true,
        config: { showConfidenceIntervals: true, includeBreakdown: true }
      },
      {
        id: '3',
        type: 'evidence',
        title: 'Evidence Analysis',
        enabled: false,
        config: { includeDocuments: true, showValidationStatus: true }
      },
      {
        id: '4',
        type: 'recommendations',
        title: 'Recommendations',
        enabled: true,
        config: { prioritizeByImpact: true, includeActionItems: true }
      },
      {
        id: '5',
        type: 'benchmarks',
        title: 'Industry Benchmarks',
        enabled: false,
        config: { comparisonType: 'industry', includePercentiles: true }
      },
      {
        id: '6',
        type: 'charts',
        title: 'Visual Analytics',
        enabled: true,
        config: { chartTypes: ['radar', 'bar', 'trend'], includeComparisons: true }
      }
    ];
    setSections(defaultSections);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportName(template.name);
      setSections(template.sections);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    ));
  };

  const updateSectionConfig = (sectionId: string, config: any) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, config: { ...section.config, ...config } }
        : section
    ));
  };

  const addCustomSection = () => {
    const newSection: ReportSection = {
      id: Date.now().toString(),
      type: 'summary',
      title: 'Custom Section',
      enabled: true,
      config: {}
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const generateReport = async (format: 'pdf' | 'excel' | 'powerpoint') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/reports/generate/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reportName,
          sections: sections.filter(s => s.enabled),
          format,
          assessmentData
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      await fetch('/api/v1/reports/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reportName,
          description: 'Custom report template',
          sections,
          format: 'pdf'
        })
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>
            <div>
              <Label htmlFor="template">Use Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Report Sections</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Sections</CardTitle>
                <Button onClick={addCustomSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => (
                  <Card key={section.id} className={`border ${section.enabled ? 'border-blue-200' : 'border-gray-200'}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={section.enabled}
                            onCheckedChange={() => toggleSection(section.id)}
                          />
                          <div>
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{section.type} section</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {section.enabled && (
                        <div className="pl-6 space-y-2">
                          {section.type === 'summary' && (
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={section.config.includeKeyFindings}
                                onCheckedChange={(checked) =>
                                  updateSectionConfig(section.id, { includeKeyFindings: checked })
                                }
                              />
                              <Label>Include key findings</Label>
                            </div>
                          )}
                          {section.type === 'scores' && (
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={section.config.showConfidenceIntervals}
                                onCheckedChange={(checked) =>
                                  updateSectionConfig(section.id, { showConfidenceIntervals: checked })
                                }
                              />
                              <Label>Show confidence intervals</Label>
                            </div>
                          )}
                          {section.type === 'benchmarks' && (
                            <Select
                              value={section.config.comparisonType}
                              onValueChange={(value) =>
                                updateSectionConfig(section.id, { comparisonType: value })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="industry">Industry Average</SelectItem>
                                <SelectItem value="peers">Peer Organizations</SelectItem>
                                <SelectItem value="leaders">Market Leaders</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gray-50 min-h-96">
                <h1 className="text-2xl font-bold mb-4">{reportName || 'Untitled Report'}</h1>
                {sections.filter(s => s.enabled).map((section, index) => (
                  <div key={section.id} className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">
                      {index + 1}. {section.title}
                    </h2>
                    <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {section.type === 'summary' && 'Executive summary with key findings and recommendations...'}
                      {section.type === 'scores' && 'Trust domain scores with confidence intervals...'}
                      {section.type === 'evidence' && 'Evidence analysis and validation status...'}
                      {section.type === 'recommendations' && 'Prioritized recommendations and action items...'}
                      {section.type === 'benchmarks' && 'Industry benchmarking and percentile rankings...'}
                      {section.type === 'charts' && 'Visual analytics and comparison charts...'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Export Format</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => generateReport('pdf')}
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => generateReport('excel')}
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => generateReport('powerpoint')}
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PowerPoint
                    </Button>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={saveTemplate} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Save as Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}