// Layer Analysis prompt templates
// Uses rubrics from trust-framework/prompts/

export const LAYER_ANALYSIS_SYSTEM_PROMPT = `You are a Trust Assessment Analyst specializing in the Trust Diagnostic Toolkit™ 2.0.
Your role is to analyze assessment responses for specific trust layers and generate insightful summaries.

CRITICAL RULES:
1. Base analysis ONLY on provided evidence and responses
2. Use the scoring rubric provided for interpretation
3. Identify themes, patterns, and contradictions
4. Write in professional prose - no bullet points or headers
5. Cite specific evidence to support claims
6. Keep each layer summary to 100-150 words`;

export const LAYER_NAMES: Record<string, string> = {
    L1: 'Reliability',
    L2: 'Transparency',
    L3: 'Governance',
    L4: 'Competence',
    L5: 'Integrity',
    L6: 'Ecosystem'
};

export const LAYER_QUESTIONS: Record<string, string> = {
    L1: 'Will this work consistently under MY conditions?',
    L2: 'Do I understand what this system does with my data?',
    L3: 'Who is responsible when things go wrong?',
    L4: 'Can we operate, maintain, and optimize this?',
    L5: 'Will this partner be here long-term?',
    L6: 'Are the interdependent systems trustworthy enough?'
};

export function buildLayerAnalysisPrompt(data: {
    layerId: string;
    layerScore: number;
    responses: { question: string; answer: string; likertScore?: number }[];
    evidence: { source: string; content: string }[];
}): string {
    const layerName = LAYER_NAMES[data.layerId] || data.layerId;
    const stakeholderQuestion = LAYER_QUESTIONS[data.layerId] || '';

    const responsesText = data.responses.length > 0
        ? data.responses.map(r =>
            `Q: ${r.question}\nA: ${r.answer}${r.likertScore ? ` (Score: ${r.likertScore}/5)` : ''}`
        ).join('\n\n')
        : 'No responses available';

    const evidenceText = data.evidence.length > 0
        ? data.evidence.map(e => `[${e.source}]: ${e.content}`).join('\n')
        : 'No evidence collected';

    return `Analyze this trust layer and generate a summary paragraph:

LAYER: ${data.layerId} - ${layerName}
STAKEHOLDER QUESTION: "${stakeholderQuestion}"
LAYER SCORE: ${data.layerScore.toFixed(1)}/5.0

ASSESSMENT RESPONSES:
${responsesText}

EVIDENCE:
${evidenceText}

Generate a 100-150 word analysis paragraph covering:
1. Overall assessment of this layer based on evidence
2. Key strengths identified (with specific citations)
3. Key gaps or concerns (with specific citations)
4. How well the partner answers the stakeholder question`;
}

export function buildContradictionAnalysisPrompt(data: {
    responses: { question: string; respondent: string; answer: string }[];
}): string {
    const responsesText = data.responses
        .map(r => `[${r.respondent}] Q: ${r.question}\nA: ${r.answer}`)
        .join('\n\n');

    return `Analyze these assessment responses for contradictions between respondents:

RESPONSES BY RESPONDENT:
${responsesText}

Identify any significant contradictions or inconsistencies:
1. List each contradiction found (if any)
2. Explain why it's significant
3. Suggest which perspective is more reliable (if determinable)

If no contradictions found, state "No significant contradictions identified."`;
}
