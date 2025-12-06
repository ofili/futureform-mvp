'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sparkles,
    FileText,
    AlertTriangle,
    Loader2,
    RefreshCw,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface CoPilotPanelProps {
    assessmentId: string;
    assessmentName?: string;
}

interface Summary {
    executiveSummary: string;
    keyFindings: string[];
    overallAssessment: string;
    layerSummaries?: Array<{
        layerId: string;
        layerName: string;
        summary: string;
        score: number;
    }>;
}

interface RiskFlag {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    message: string;
    vetoTrigger: boolean;
}

interface RiskAnalysis {
    redFlags: RiskFlag[];
    overallRiskLevel: string;
    vetoTriggered: boolean;
    vetoReason?: string;
}

export function CoPilotPanel({ assessmentId, assessmentName }: CoPilotPanelProps) {
    const [activeTab, setActiveTab] = useState('summary');
    const [summary, setSummary] = useState<Summary | null>(null);
    const [risks, setRisks] = useState<RiskAnalysis | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingRisks, setIsLoadingRisks] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const generateSummary = useCallback(async () => {
        setIsLoadingSummary(true);
        try {
            const res = await fetch(`/api/v1/copilot/${assessmentId}/summarize`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                setSummary(data.data);
                toast.success('Summary generated');
            } else {
                toast.error(data.error || 'Failed to generate summary');
            }
        } catch (error) {
            toast.error('Failed to generate summary');
        } finally {
            setIsLoadingSummary(false);
        }
    }, [assessmentId]);

    const analyzeRisks = useCallback(async () => {
        setIsLoadingRisks(true);
        try {
            const res = await fetch(`/api/v1/copilot/${assessmentId}/risks`);
            const data = await res.json();
            if (data.success) {
                setRisks(data.data);
                toast.success('Risk analysis complete');
            } else {
                toast.error(data.error || 'Failed to analyze risks');
            }
        } catch (error) {
            toast.error('Failed to analyze risks');
        } finally {
            setIsLoadingRisks(false);
        }
    }, [assessmentId]);

    const generateReport = useCallback(async () => {
        setIsGeneratingReport(true);
        try {
            const res = await fetch(`/api/v1/copilot/${assessmentId}/report`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Draft report generated');
                // TODO: Open report viewer or download
            } else {
                toast.error(data.error || 'Failed to generate report');
            }
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setIsGeneratingReport(false);
        }
    }, [assessmentId]);

    const copySummary = () => {
        if (summary) {
            const text = `${summary.executiveSummary}\n\nKey Findings:\n${summary.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n${summary.overallAssessment}`;
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Copied to clipboard');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'destructive';
            case 'high': return 'default';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-violet-200 dark:border-violet-800">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-violet-600" />
                        <CardTitle className="text-lg">AI Co-Pilot</CardTitle>
                        <Badge variant="secondary" className="text-xs">Beta</Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
                {isExpanded && (
                    <CardDescription>
                        AI-powered analysis and report generation
                    </CardDescription>
                )}
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="risks" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Risks
                                {risks && risks.redFlags.length > 0 && (
                                    <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                                        {risks.redFlags.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="report">Report</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-4">
                            {!summary ? (
                                <div className="text-center py-6">
                                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Generate an AI-powered executive summary
                                    </p>
                                    <Button
                                        onClick={generateSummary}
                                        disabled={isLoadingSummary}
                                    >
                                        {isLoadingSummary ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Generate Summary
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={copySummary}
                                        >
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={generateSummary}
                                            disabled={isLoadingSummary}
                                        >
                                            <RefreshCw className={`h-4 w-4 ${isLoadingSummary ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                    <div className="prose dark:prose-invert prose-sm max-w-none">
                                        <p>{summary.executiveSummary}</p>
                                        <h4>Key Findings</h4>
                                        <ul>
                                            {summary.keyFindings.map((finding, i) => (
                                                <li key={i}>{finding}</li>
                                            ))}
                                        </ul>
                                        <p className="font-medium">{summary.overallAssessment}</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="risks" className="space-y-4">
                            {!risks ? (
                                <div className="text-center py-6">
                                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Analyze risks and red flags
                                    </p>
                                    <Button
                                        onClick={analyzeRisks}
                                        disabled={isLoadingRisks}
                                    >
                                        {isLoadingRisks ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="mr-2 h-4 w-4" />
                                                Analyze Risks
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {risks.vetoTriggered && (
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>VETO TRIGGERED:</strong> {risks.vetoReason}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium">Overall Risk Level: </span>
                                            <Badge variant={risks.overallRiskLevel === 'critical' ? 'destructive' : 'secondary'}>
                                                {risks.overallRiskLevel.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={analyzeRisks}
                                            disabled={isLoadingRisks}
                                        >
                                            <RefreshCw className={`h-4 w-4 ${isLoadingRisks ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {risks.redFlags.map((flag, i) => (
                                            <div
                                                key={flag.id || i}
                                                className={`p-3 rounded-md border ${flag.vetoTrigger ? 'border-destructive bg-destructive/10' : 'bg-muted/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={getSeverityColor(flag.severity) as any}>
                                                        {flag.severity.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{flag.category}</span>
                                                    {flag.vetoTrigger && (
                                                        <Badge variant="destructive" className="ml-auto">VETO</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm">{flag.message}</p>
                                            </div>
                                        ))}

                                        {risks.redFlags.length === 0 && (
                                            <p className="text-center text-sm text-muted-foreground py-4">
                                                No red flags detected
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="report" className="space-y-4">
                            <div className="text-center py-6">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-sm text-muted-foreground mb-4">
                                    Generate a complete draft due diligence report
                                </p>
                                <Button
                                    onClick={generateReport}
                                    disabled={isGeneratingReport}
                                >
                                    {isGeneratingReport ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating Report...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Generate Draft Report
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Takes ~30-60 seconds for comprehensive analysis
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            )}
        </Card>
    );
}
