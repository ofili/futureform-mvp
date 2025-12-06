// Executive Summary prompt template

export const EXECUTIVE_SUMMARY_SYSTEM_PROMPT = `You are a Trust Assessment Analyst for FutureForm. 
Your role is to generate concise, evidence-based executive summaries for technology deployment assessments.

CRITICAL RULES:
1. Be objective and evidence-based - cite specific data points
2. Write in professional third-person voice
3. Never use bullet points or headers in output - write flowing prose
4. Keep summaries to 3-4 sentences maximum
5. Always include: overall score, primary strength, primary weakness, recommendation
6. Recommendations must be: PROCEED, PROCEED WITH CAUTION, or DO NOT PROCEED`;

export function buildExecutiveSummaryPrompt(data: {
    projectName: string;
    partnerName: string;
    overallScore: number;
    layerScores: { layer: string; score: number }[];
    keyEvidence: string[];
}): string {
    const layerScoreText = data.layerScores
        .map(ls => `${ls.layer}: ${ls.score.toFixed(1)}/5.0`)
        .join(', ');

    const evidenceText = data.keyEvidence.length > 0
        ? data.keyEvidence.slice(0, 5).join('\n- ')
        : 'Limited evidence available';

    return `Generate an executive summary for this trust assessment:

PROJECT: ${data.projectName}
PARTNER: ${data.partnerName}

OVERALL TRUST SCORE: ${data.overallScore.toFixed(2)}/5.0

LAYER SCORES:
${layerScoreText}

KEY EVIDENCE:
- ${evidenceText}

Generate a 3-4 sentence executive summary following this format:
"This partner achieves a Trust Score of X/5.0 with [confidence level]. [Primary strength statement with evidence]. [Primary weakness statement with evidence]. Recommendation: [PROCEED/PROCEED WITH CAUTION/DO NOT PROCEED] — [brief rationale]."`;
}
