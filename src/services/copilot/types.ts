// Shared types for Copilot services

export interface LLMRequest {
    prompt: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
}

export interface LLMResponse {
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface LayerSummary {
    layerId: string;
    layerName: string;
    score: number;
    summary: string;
    keyPoints: string[];
    evidenceCitations: string[];
}

export interface Summary {
    executive: string;
    byLayer: LayerSummary[];
    keyThemes: string[];
    contradictions: string[];
    confidence: number;
}

export interface ReportSection {
    type: 'executive' | 'strengths' | 'weaknesses' | 'red_flags' | 'recommendations';
    content: string;
    confidence: number;
    evidenceCitations: string[];
}

export interface DraftReport {
    assessmentId: string;
    generatedAt: Date;
    sections: ReportSection[];
    overallConfidence: number;
    tokensUsed: number;
}

export interface RedFlag {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    layer: string;
    subDimension?: string;
    message: string;
    recommendation: string;
    evidence: string[];
    confidence: number;
    vetoTrigger: boolean;
}

export interface RiskAssessment {
    assessmentId: string;
    redFlags: RedFlag[];
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    vetoTriggered: boolean;
    vetoReason?: string;
    analysisTimestamp: Date;
}

// Veto criteria from trust-framework config
export interface VetoCriteria {
    veto_id: string;
    layer: string;
    sub_dimension: string;
    metric: string;
    threshold: number | null;
    threshold_description: string;
    rationale: string;
    action: string;
    severity: string;
}

// Layer data types
export interface AssessmentData {
    id: string;
    projectName: string;
    partnerName: string;
    responses: AssessmentResponse[];
    evidenceFacts: EvidenceFact[];
    layerScores: LayerScore[];
}

export interface AssessmentResponse {
    questionId: string;
    questionText: string;
    layer: string;
    subDimension: string;
    response: string;
    likertScore?: number;
    respondentRole: string;
}

export interface EvidenceFact {
    id: string;
    sourceType: string;
    content: string;
    confidence: number;
    layer: string;
}

export interface LayerScore {
    layerId: string;
    layerName: string;
    score: number;
    weight: number;
    subDimensionScores: SubDimensionScore[];
}

export interface SubDimensionScore {
    id: string;
    name: string;
    score: number;
    weight: number;
}
