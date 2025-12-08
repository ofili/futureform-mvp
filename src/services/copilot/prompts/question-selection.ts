/**
 * Question Selection Prompts
 * 
 * Prompt templates for AI-powered question selection in trust assessments.
 */

export const QUESTION_SELECTION_SYSTEM_PROMPT = `You are an expert Trust Assessment Analyst with deep knowledge of the Gitance Trust Framework.

THE 6 TRUST LAYERS:
1. RELIABILITY - Operational consistency, uptime, performance track record
2. TRANSPARENCY - Openness in operations, data handling, communication
3. GOVERNANCE - Decision-making structures, compliance, oversight
4. COMPETENCE - Technical capability, qualifications, track record  
5. INTEGRITY - Ethical behavior, honesty, conflict management
6. ECOSYSTEM - Relationships, partnerships, reputation in market

YOUR TASK:
Select and prioritize questions from the provided question bank based on:
- Partner type and sector context
- Assessment depth requirements
- Regional/regulatory considerations
- Document context (if provided)

CRITICAL RULES:
1. Only select questions from the provided question bank - never invent questions
2. Prioritize questions that reveal critical trust indicators
3. Ensure balanced coverage across all 6 trust layers
4. Consider sector-specific risks (e.g., financial for fintech, safety for infrastructure)
5. Assign confidence scores based on question relevance (0.0-1.0)
6. Suggest appropriate respondent roles for each question
7. Suggest evidence types that would validate responses

OUTPUT FORMAT (JSON):
{
  "selectedQuestions": [
    {
      "questionId": "uuid from question bank",
      "confidence": 0.95,
      "rationale": "Why this question is critical for this assessment",
      "suggestedRole": "Role best suited to answer",
      "suggestedSeniority": "C-Level/Director/Manager/Staff",
      "suggestedEvidence": ["Evidence Type 1", "Evidence Type 2"],
      "priority": 1
    }
  ],
  "layerCoverage": {
    "RELIABILITY": 5,
    "TRANSPARENCY": 4,
    "GOVERNANCE": 5,
    "COMPETENCE": 4,
    "INTEGRITY": 3,
    "ECOSYSTEM": 4
  },
  "analysisNotes": "Brief notes on selection strategy and any concerns"
}`;

export interface QuestionSelectionInput {
    partnerType: string;
    sector: string;
    region: string;
    depth: 'quick' | 'standard' | 'deep';
    projectContext?: string;
    documentSummary?: string;
    questionBank: QuestionBankItem[];
}

export interface QuestionBankItem {
    id: string;
    text: string;
    layer: string;
    subDimension?: string;
    category?: string;
    requiredRoles?: string[];
}

export function buildQuestionSelectionPrompt(input: QuestionSelectionInput): string {
    const depthConfig = {
        quick: { target: 15, description: 'Quick assessment - focus on critical indicators only' },
        standard: { target: 30, description: 'Standard assessment - balanced coverage across layers' },
        deep: { target: 50, description: 'Comprehensive assessment - thorough coverage with detailed questions' }
    };

    const config = depthConfig[input.depth];

    // Format question bank for prompt
    const questionBankText = input.questionBank
        .map(q => `[ID: ${q.id}] [Layer: ${q.layer}] ${q.text}`)
        .join('\n');

    let prompt = `SELECT QUESTIONS FOR TRUST ASSESSMENT

PARTNER CONTEXT:
- Partner Type: ${input.partnerType}
- Sector: ${input.sector}
- Region: ${input.region}
- Assessment Depth: ${input.depth} (${config.description})
- Target Question Count: ~${config.target} questions

${input.projectContext ? `PROJECT CONTEXT:\n${input.projectContext}\n` : ''}
${input.documentSummary ? `DOCUMENT ANALYSIS:\n${input.documentSummary}\n` : ''}

QUESTION BANK (${input.questionBank.length} available):
${questionBankText}

SELECTION REQUIREMENTS:
1. Select approximately ${config.target} questions
2. Ensure all 6 trust layers are covered
3. Prioritize sector-specific risks for ${input.sector}
4. Consider regional context for ${input.region}
5. Match questions to appropriate respondent roles

Return your selection as JSON matching the specified format.`;

    return prompt;
}

/**
 * Document Analysis Prompt
 * Used to extract relevant context from uploaded documents
 */
export const DOCUMENT_ANALYSIS_SYSTEM_PROMPT = `You are a document analyst extracting relevant information for trust assessments.

Analyze the provided document and extract:
1. Key facts about the organization
2. Risk indicators or concerns
3. Compliance or certification mentions
4. Partnership or vendor relationships
5. Financial health indicators
6. Governance structures

Provide a concise summary (max 300 words) focusing on information relevant to trust assessment.`;

export function buildDocumentAnalysisPrompt(documentContent: string): string {
    return `Analyze this document for trust assessment context:

DOCUMENT CONTENT:
${documentContent.substring(0, 10000)}${documentContent.length > 10000 ? '\n\n[Document truncated...]' : ''}

Provide a structured summary of trust-relevant information found in this document.`;
}

/**
 * Sector-Specific Risk Prompt
 * Used to identify sector-specific questions to prioritize
 */
export function buildSectorRiskPrompt(sector: string, partnerType: string): string {
    return `Identify the top 5 trust risks for a ${partnerType} in the ${sector} sector.

For each risk:
1. Risk Category (which trust layer)
2. Risk Description
3. Key Questions to Ask
4. Evidence to Request

Format as a prioritized list.`;
}
